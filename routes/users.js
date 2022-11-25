const express = require("express");
const { signup, signin, getUsersList,deleteUser, updateUserStatus } = require("../controllers/userController");
const {auth} = require('../middlewares/auth')
const userRouter = express.Router();

userRouter.post("/signup", signup);


userRouter.post("/signin", signin);

userRouter.get("/", auth, getUsersList);

userRouter.delete("/:id", auth, deleteUser)
userRouter.put("/:id", auth, updateUserStatus)

    // This section will help you get a list of all the records.
    // 

// // This section will help you create a new record.


// // This section will help you update a record by id.
// recordRoutes.route('/:id').put(function(req, res) {
//     const dbConnect = dbo.getDb();
//     const query = { $set: { status: req.body.status } };


//     dbConnect
//         .collection('users')
//         .updateOne({ _id: ObjectId(req.params.id) }, query, { upsert: false }, function(err, _result) {
//             if (err) {
//                 console.log(err)
//                 res
//                     .status(400)
//                     .send(`Error updating likes on listing with id ${listingQuery.id}!`);
//             } else {
//                 console.log('1 document updated');
//                 res.status(204).send();
//             }
//         });
// });

// This section will help you delete a record.
// recordRoutes.route('/:id').delete((req, res) => {
//     const dbConnect = dbo.getDb();
//     console.log(req.params.id)
//     const query = { _id: ObjectId(req.params.id) };

//     dbConnect
//         .collection('users')
//         .deleteOne(query, function(err, _result) {
//             if (err) {
//                 console.log(err)
//                 res
//                     .status(400)
//                     .send(`Error deleting listing with id ${query._id}!`);
//             } else {
//                 console.log('1 document deleted');
//                 res.status(204).send();
//             }
//         });
// });

module.exports = userRouter;