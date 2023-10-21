const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// Middleware  
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.MDB_USER}:${process.env.MDB_PASS}@cluster0.5tb2p8r.mongodb.net/?retryWrites=true&w=majority`;
// git remote add origin https://github.com/programming-hero-web-course-4/b8a10-brandshop-server-side-Md-Hasan-Arif.git



// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const productCollection = client.db('productDB').collection('product')
    const addProductCollection = client.db('SaveProductDB').collection('addedCardProduct')


    app.get('/addProduct',async (req,res)=>{
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })
    app.get('/saveProduct',async (req,res)=>{
      const cursor =addProductCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })
    app.get('/saveProduct/:id',async (req,res)=>{
      const id = req.params.id;
      const query= {_id: new ObjectId(id)}
      const result = await addProductCollection.findOne(query)
      res.send(result);
      res.send(result);
    })

   app.get('/product/:brandName',async(req, res)=>{
    const brandName=req.params.brandName;
    const query ={BrandName:brandName}
    const products = await productCollection.find(query).toArray();
    res.send(products)
     }) 

    app.post('/addProduct',async(req, res)=>{
      const newProduct= req.body;
      console.log(newProduct)
      const result = await productCollection.insertOne(newProduct);
      res.send(result);
    })

    app.post('/saveProduct',async(req, res)=>{
      const newProduct= req.body;
      console.log(newProduct)
      const result = await addProductCollection.insertOne(newProduct);
      res.send(result);
    })

    app.delete('/addProduct/:id', async (req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await productCollection.deleteOne(query);
      res.send(result);
  })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req,res)=>{
    res.send('Hey Server is running')
})



app.listen(port,()=>{
    console.log(`Your Server is running on port:${port}`)
})
