const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, Collection, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;

//middleware
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://smartdbUser:HtBTknY9jzxYcBvf@contesthubcluster.tjeey7t.mongodb.net/?appName=ContestHubCluster";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.get('/', (req, res) => {
  res.send('Smart server is running!')
})

async function run (){

  try{

  }
  finally{
    await client.connect();
    const db = client.db('smart_db');
    const productsCollection = db.collection('products');
    const bidsCollection = db.collection('bids');

  //  To get all products

    app.get('/products', async ( req , res )=>{
    // const cursor = productsCollection.find().sort({price_min: 1});
     

    // To find specific email-product
     console.log(req.query);
     const email = req.query.email ;
     const query = {}
     if(email){
      query.email = email;
     }
    

    const cursor = productsCollection.find(query);
     const result = await cursor.toArray();
     res.send(result);
   })

  //  To find one

   app.get('/products/:id' ,async (req,res)=>{
    const id = req.params.id;
    const query = {_id: new ObjectId(id)};
    const result = await productsCollection.findOne(query);
    res.send(result);
    
   })

  //  To create one

   app.post('/products', async ( req , res )=>{
    const newProduct = req.body;
     const result = await productsCollection.insertOne(newProduct);
     res.send(result);
   })
    
  //  To delete one

   app.delete('/products/:id' ,async (req,res)=>{
    const id = req.params.id;
    const query = {_id: new ObjectId(id)};
    const result = await productsCollection.deleteOne(query);
    res.send(query);
    
   })

  //  To update one

   app.patch('/products/:id' ,async (req,res)=>{
    const id = req.params.id;
    const updateProduct = req.body;

    const query = {_id: new ObjectId(id)};
     const update = {
      $set:{
        name : updateProduct.name,
        price : updateProduct.price
      }
     }


    const result = await productsCollection.updateOne(query,update);
    res.send(result);
    
   })



   //Bids related APIs
   app.get('/bids' , async(req , res) =>{

   const email = req.query.email;
   const query = {}
   if(email){
    query.buyer_email = email;
   }

    const cursor = bidsCollection.find(query);
    const result = await cursor.toArray();
    res.send(result)
   })

   app.post('/bids' , async(req, res) =>{
    const newBid = req.body;
    const result = await bidsCollection.insertOne(newBid);
    res.send(result);

   })


    app.delete('/bids/:id' ,async (req,res)=>{
    const id = req.params.id;
    const query = {_id: new ObjectId(id)};
    const result = await bidsCollection.deleteOne(query);
    res.send(query);
    
   })



    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

  }
}
run().catch(console.dir)

app.listen(port, () => {
  console.log(`Smart server is running on port: ${port}`)
});
