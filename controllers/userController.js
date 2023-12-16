const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");



const Users = mongoose.model("Users", {
    userName: String,
    email: String,
    mobile: String,
    password: String,
    likedProducts: [{type: mongoose.Schema.Types.ObjectId, ref: 'Products'}]
  });


module.exports.likeProducts = (req, res) => {
    let productId = req.body.productId;
    let userId = req.body.userId;
    console.log(req.body)
    Users.updateOne({_id: userId}, {$addToSet: {likedProducts: productId}})
    .then(()=>{
      res.send({message: 'Liked Success'})
    })
    .catch((err) => {
      res.send({message: 'Server Error'})
  
    })
  }
  module.exports.signup = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const userName = req.body.userName;
    const mobile = req.body.mobile;
    const user = new Users({ email, password, userName, mobile });
    user.save()
      .then(() => {
        res.send({ message: "Signup Successfully" });
      })
      .catch(() => {
        res.send({ message: "server error" });
      });
  }

  module.exports.myProfileById = (req, res) => {
    let uid = req.params.userId
    Users.findOne({_id : uid})
    .then((result) => {
      res.send({message: 'Success', user: {
        email : result.email,
         mobile: result.mobile,
         userName: result.userName
        }
      }) 
    })
    .catch(() => {
      res.send({ message: "server error" })
    })
  }

  module.exports.getUserById = (req, res) => {
    const userId = req.params.uid
    Users.findOne({_id: userId})
    .then((result)=>{
      res.send({message: 'Success', user: {email : result.email, mobile: result.mobile, userName: result.userName}})
    })
    .catch((err) => {
      res.send({message: 'Server Error'})
  
    })
  }

  module.exports.login = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    Users.findOne({ email: email })
      .then((result) => {
        const token = jwt.sign(
          {
            data: result,
          },
          "MYKEY",
          { expiresIn: "1h" }
        );
        if (!result) {
          res.send({ message: "User not found" });
        } else {
          res.send({ message: "login Successfully", token: token, userId: result._id });
        }
      })
      .catch(() => {
        res.send({ message: "server error" });
      });
  }

  module.exports.likedProducts = (req, res) => {
    Users.findOne({_id: req.body.userId}).populate('likedProducts')
    .then((result)=>{
      res.send({message: 'Success', products: result.likedProducts})
    })
    .catch((err) => {
      res.send({message: 'Server Error'})
  
    })
  }