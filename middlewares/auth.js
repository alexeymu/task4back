const jwt = require("jsonwebtoken");
const dbo = require('../db/conn');
const { SECRET_KEY } = require("../consts");

const auth = async (req, res, next) => {
  try {
    let authorization = req.headers.authorization;
    if (authorization) {
      const token = authorization.split(" ")[1];
      const result = jwt.verify(token, SECRET_KEY, {complete: true});
      console.log(result, req.originalUrl)

      if (result.payload.email) {
        const user = await getUser(result.payload.email);
        if (!user || user.status === 0) {
          res.status(401).json({message: 'Unauthorized user'})
          return
        }
      } else {
        res.status(401).json({message: 'Unauthorized user'})
        return
      }
    } else {
      res.status(401).json({message: 'Unauthorized user'})
      return
    }

    next();
  } catch (e) {
    console.log(e);
    res.status(401).json({message: 'Unauthorized user'})
  }
}

async function getUser(email) {
  const dbConnect = dbo.getDb();
  return await dbConnect.collection('users').findOne({ email })
}

module.exports = { auth };