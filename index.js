const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;
require('dotenv').config()

var jwt = require('jsonwebtoken');

app.use(express.json());
app.use(cookieParser());
app.use(cors(
  {
    origin: ['http://localhost:5173'],
    credentials: true,
  }
));
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
    const bookingsCollection = client.db("TraveGo").collection("bookings");

    // jwt
    app.post("/jwt", async (req, res) => {
      const request = req.body;
      // console.log(request);
      // res.send(request);
      const token = jwt.sign(request, "secret", { expiresIn: "2h" });
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none"
      })
        .send({ msg: "success" })
    })
    app.post("/logout", async (req, res) => {
      const user = req.body;
      res.clearCookie("token").send({ msg: "cleared cookie" })
    })




    // console.log(servicesCollection);
    // services
    app.get("/services", async (req, res) => {
      const result = await servicesCollection.find().toArray();
      res.send(result);
    })

    app.get("/service/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const query = { _id: new ObjectId(id) }
      const result = await servicesCollection.findOne(query);
      res.send(result);
    })

    app.post("/services", async (req, res) => {
      const service = req.body;
      // console.log(data);
      const result = await servicesCollection.insertOne(service)
      res.send(result);

    })

    app.patch("/service/:id", async (req, res) => {
      const id = req.params.id;
      const updateRequest = req.body;
      // console.log(updateRequest);
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true }
      const updatedService = {
        $set: {
          name: updateRequest.name,
          price: updateRequest.price,
          photo: updateRequest.photo,
          location: updateRequest.location,
          description: updateRequest.description,
        }
      }
      const result = await servicesCollection.updateOne(filter, updatedService, options);
      res.send(result);

    })



    // my services
    app.get("/myservices", async (req, res) => {
      // const email = req.query.email;
      let query = {};
      if (req.query?.email) {
        query = {
          email: req.query.email,
        }
      }
      const result = await servicesCollection.find(query).toArray();
      res.send(result);
      // console.log(email);
      // res.send(email);
    })

    app.delete("/myservices/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await servicesCollection.deleteOne(query);
      res.send(result);
    })



    // bookings
    app.post("/bookings", async (req, res) => {
      const bookings = req.body;
      // console.log(bookings);
      const result = await bookingsCollection.insertOne(bookings);
      res.send(result);
    })
    app.get("/bookings", async (req, res) => {
      let query = {}
      if (req.query?.usermail) {
        query = {
          usermail: req.query.usermail
        }
      }
      const result = await bookingsCollection.find(query).toArray();
      res.send(result)
    })

    app.get("/booking/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await bookingsCollection.findOne(query);
      res.send(result);
    })

    app.delete("/bookings/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await bookingsCollection.deleteOne(query);
      res.send(result);
    })

    app.patch("/booking/:id", async (req, res) => {
      const id = req.params.id;
      const updateRequest = req.body;
      // console.log(updateRequest);
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true }
      const updatedService = {
        $set: {
          date: updateRequest.date,
          instructions: updateRequest.instructions,
        }
      }
      const result = await bookingsCollection.updateOne(filter, updatedService, options);
      res.send(result);

    })



    // schedules
    app.get("/schedules", async (req, res) => {
      let query = {};
      if (req.query?.hostEmail) {
        query = {
          hostEmail: req.query.hostEmail,
        }
      }
      const result = await bookingsCollection.find(query).toArray();
      res.send(result);
    })

    app.patch("/schedules/:id", async (req, res) => {
      const id = req.params.id;
      const updateRequest = req.body;
      // console.log(updateRequest);
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          status: updateRequest.status,
        }
      }
      const result = await bookingsCollection.updateOne(filter, updatedDoc, options);
      res.send(result);
    })



    // destinations
    app.get("/destinations", async (req, res) => {
      const result = await destinationsCollection.find().toArray();
      res.send(result);
    })
    // reviews
    app.get("/reviews", async (req, res) => {
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


app.get("/", (req, res) => {
  // console.log("Travego Server Is Running Successfully!!!");
  res.send("Travego Server Is Running Successfully!!!")
})

app.listen(port, () => {
  console.log(`server is running on port: ${port}`);
})

