const express = require("express");
const multer = require("multer");
const productController = require('./controllers/productController')
const userController = require('./controllers/userController')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });
const cors = require("cors");
const path = require('path')
const jwt = require("jsonwebtoken");

const bodyParser = require("body-parser");

const app = express();

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const port = 4000;
const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb://raju:raju@ac-5bh2cya-shard-00-00.vk2pxgb.mongodb.net:27017,ac-5bh2cya-shard-00-01.vk2pxgb.mongodb.net:27017,ac-5bh2cya-shard-00-02.vk2pxgb.mongodb.net:27017/?replicaSet=atlas-21rtfj-shard-0&ssl=true&authSource=admin"
  )
  .then(() => console.log("Connected!"));




app.put('/like-product', userController.likeProducts)

app.get("/get-products", productController.getProducts);

app.get("/search", productController.search);


app.get("/get-product/:id", productController.getProductsById);

app.get('/get-user/:uid', userController.getUserById)
app.post("/liked-products", userController.likedProducts);


app.post("/my-products", productController.myProducts);


app.get('/my-profile/:userId', userController.myProfileById)

app.post("/signup", userController.signup);

app.post("/login", userController.login);

app.post("/add-product", upload.fields([{ name: 'pImage' }, { name: 'pImage2' } ]), productController.addProduct);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
