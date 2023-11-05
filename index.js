const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
require('dotenv').config()



const { MongoClient, ServerApiVersion } = require('mongodb');
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
    // console.log(servicesCollection);
    app.get("/services", async(req,res)=>{
      const result = await servicesCollection.find().toArray();
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

