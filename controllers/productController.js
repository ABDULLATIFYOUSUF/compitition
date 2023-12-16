const mongoose = require("mongoose");


let schema = new mongoose.Schema({
  pName: String,
  desc: String,
  price: String,
  category: String,
  pImage: String,
  pImage2: String,
  addedBy: mongoose.Schema.Types.ObjectId,
  pLoc : {
    type : {
      type : String,
      enum : ['Point'],
      default : 'Point'
    }, 
    coordinates : {
        type : [Number]
    }
  }
})
schema.index({ pLoc : '2dsphere' });

const Products = mongoose.model("Products", schema);

module.exports.search = (req, res) => {
    console.log(req.query)
    let latitude = req.query.loc.split(',')[0]
    let longitude = req.query.loc.split(',')[1]
    let search = req.query.search;
    Products.find({
      $or: [
        {pName : { $regex : search }},
        {desc : { $regex : search }},
        {price : { $regex : search }},
        {category : { $regex : search }}
        ],
  
        pLoc : {
          $near : {
            $geometry : {
              type : 'Point',
              coordinates : [ parseFloat(latitude), parseFloat(longitude) ]
            },
            // $maxDistance : 50000,
          }
        }
  
    }) 
    .then((results)=>{
      res.send({message: 'Success', products: results})
    })
    .catch((err) => {
      res.send({message: 'Server Error'})
  
    })
  }

module.exports.addProduct = (req, res) => {
  console.log(req.files)
  console.log(req.body)

  const plat = req.body.plat;
  const plong = req.body.plong;
  const pName = req.body.pName;
  const desc = req.body.desc;
  const price = req.body.price;
  const category = req.body.category;
  const pImage = req.files.pImage[0].path;
  const pImage2 = req.files.pImage2[0].path;
  const addedBy = req.body.userId;
  const products = new Products({pName, desc, price, category, pImage, pImage2, addedBy, pLoc :  {type : 'Point', coordinates : [plat, plong]}});
  products.save()
    .then(() => {
      res.send({ message: "Saved Successfully" });
    })
    .catch(() => {
      res.send({ message: "server error" });
    });


}

module.exports.getProducts = (req, res) => {

  const catName = req.query.catName;
  let _f = {}
  if(catName){
    _f = {category : catName}
  }
  Products.find(_f)
  .then((result)=>{
    res.send({message: 'Success', products: result})
  })
  .catch((err) => {
    res.send({message: 'Server Error'})

  })
}

module.exports.getProductsById = (req, res) => {
  console.log(req.params)
  Products.findOne({_id: req.params.id})
  .then((result)=>{
    res.send({message: 'Success', product: result})
  })
  .catch((err) => {
    res.send({message: 'Server Error'})

  })
}

module.exports.myProducts = (req, res) => {
  const userId = req.body.userId;
  Products.find({addedBy : userId})
  .then((result)=>{
    res.send({message: 'Success', products: result})
  })
  .catch((err) => {
    res.send({message: 'Server Error'})

  })
}

