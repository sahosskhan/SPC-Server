const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;


//middleware config
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = process.env.DB_URL;

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
    const userCollection = client.db("SpanishCityFCDb").collection("User");
    const teamCollection = client.db("SpanishCityFCDb").collection("Team");
  app.post("/users", async (req, res) => {
    const user = req.body;
    const query = { email: user.email };
    const existingUser = await userCollection.findOne(query);
    if (existingUser) {
      return res.send({ message: "User already exists", insertedInd: null });
    }
    const result = await userCollection.insertOne(user);
    res.send(result);
  });

  app.get("/user-list", async (req, res) => {
    const result = await userCollection.find().toArray();
    res.send(result);
  });
                

  app.post("/add-player", async (req, res) => {
    try {
     const playerInfo = req.body;
     const result = await teamCollection.insertOne(playerInfo);
     res.send(result);
    }
     catch (error) {
       console.log(error);
     
    }
   });
    // await client.connect();

    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('🎯 Welcome to  Server🗄️')
  })
  
  app.listen(port, () => {
    console.log(`Server is working on port ${port}`);
  })