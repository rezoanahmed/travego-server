const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;
require('dotenv').config()

app.use(express.json());
app.use(cors());
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.user}:${process.env.pass}@cluster0.lwhx9xs.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();
    // Send a ping to confirm a successful connection


    const servicesCollection = client.db("TraveGo").collection("services");
    const destinationsCollection = client.db("TraveGo").collection("destinations");
    const reviewsCollection = client.db("TraveGo").collection("reviews");
    // console.log(servicesCollection);
    // services
    app.get("/services", async(req,res)=>{
      const result = await servicesCollection.find().toArray();
      res.send(result);
    })

    app.get("/service/:id", async(req,res)=>{
      const id = req.params.id;
      // console.log(id);
      const query = {_id: new ObjectId(id)}
      const result = await servicesCollection.findOne(query);
      res.send(result);
    })

    app.post("/services", async(req,res)=>{
      const service = req.body;
      // console.log(data);
      const result = await servicesCollection.insertOne(service)
      res.send(result);

    })



    // my services
    app.get("/myservices", async(req,res)=>{
      // const email = req.query.email;
      let query = {};
      if(req.query?.email){
        query={
          email:req.query.email,
        }
      }
      const result = await servicesCollection.find(query).toArray();
      res.send(result);
      // console.log(email);
      // res.send(email);
    })



    // destinations
    app.get("/destinations", async(req,res)=>{
      const result = await destinationsCollection.find().toArray();
      res.send(result);
    })
    // reviews
    app.get("/reviews", async(req,res)=>{
      const result = await reviewsCollection.find().toArray();
      res.send(result);

    })






    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/", (req,res)=>{
    // console.log("Travego Server Is Running Successfully!!!");
    res.send("Travego Server Is Running Successfully!!!")
})

app.listen(port, ()=>{
    console.log(`server is running on port: ${port}`);
})

