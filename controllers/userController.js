const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dbo = require('../db/conn');
const { SECRET_KEY } = require("../consts");

var ObjectId = require('mongodb').ObjectID;

const signup = async(req, res) => {
    const { username, email, password } = req.body;
    try {
        const dbConnect = dbo.getDb();

        const existingUser = await dbConnect.collection('users').findOne({ email: email })

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const matchDocument = {
            username,
            dateCreate: new Date(),
            lastLogin: new Date(),
            email,
            password: hashedPassword,
            status: 1
        };

        dbConnect
            .collection('users')
            .insertOne(matchDocument, function(err, result) {
                if (err) {
                    console.log(err)
                    res.status(400).send('Error inserting matches!');
                } else {
                    const token = jwt.sign({ email: result.ops[0].email, id: result.ops[0]._id }, SECRET_KEY);
                    res.status(201).json({ user: result, token })
                }
            });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" })
    }
}

const signin = async(req, res) => {

    const { email, password } = req.body;

    try {
        const dbConnect = dbo.getDb();

        const existingUser = await dbConnect.collection('users').findOne({ email: email })
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });

        }
        const matchPassword = await bcrypt.compare(password, existingUser.password);
        if (!matchPassword) {

            return res.status(400).json({ message: "Invalid Credentials" });
        }

        if (existingUser.status === 0) {
            return res.status(400).json({ message: "User is blocked" });
        }

        // TODO update lastLogin time
            console.log(existingUser)
        const token = jwt.sign({ email: existingUser.email, id: existingUser._id}, SECRET_KEY);

        const { password: userPassword, ...userResponse } = existingUser

        res.status(201).json({ user: userResponse, token })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }


}

const deleteUser = async (req, res)=>{
 
        const dbConnect = dbo.getDb();
        console.log(req.params.id)
        const query = { _id: ObjectId(req.params.id) };
    
        dbConnect
            .collection('users')
            .deleteOne(query, function(err, _result) {
                if (err) {
                    console.log(err)
                    res
                        .status(400)
                        .send(`Error deleting listing with id ${query._id}!`);
                } else {
                    console.log('1 document deleted');
                    res.status(200).send({message: "Delete successfully" });
                }
            });
        }
const updateUserStatus = async (req,res)=>{
    const dbConnect = dbo.getDb();
    const query = { $set: { status: req.body.status } };


    dbConnect
        .collection('users')
        .updateOne({ _id: ObjectId(req.params.id) }, query, { upsert: false }, function(err, _result) {
            if (err) {
                console.log(err)
                res
                    .status(400)
                    .send(`Error updating likes on listing with id ${listingQuery.id}!`);
            } else {
                console.log('1 document updated');
                res.status(200).send({message: "Successfully" });
            }
        });
}

const getUsersList = async(req, res) => {
    const dbConnect = dbo.getDb();
    dbConnect
        .collection('users')
        .find({})
        .toArray(function(err, result) {
            if (err) {
                res.status(400).send('Error fetching listings!');
            } else {
                res.json(result);
            }
        });
}

module.exports = { signup, signin, getUsersList,  deleteUser, updateUserStatus}