const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.noswvlt.mongodb.net/?retryWrites=true&w=majority`;

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
    const userCollection = client.db("TaskDB").collection("users");
    const TaskCollection = client.db("TaskDB").collection("tasks");

   
    app.post('/users', async (req, res) => {
      const user = req.body;
      const query = { email: user.email }
      const existingUser = await userCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: 'user already exists', insertedId: null })
      }
      const result = await userCollection.insertOne(user);
      res.send(result);
    });
    app.post('/tasks', async (req, res) => {
        const user = req.body;
        const result = await TaskCollection.insertOne(user);
        res.send(result);
      });
      app.post('/tasks', async (req, res) => {
        const user = req.body;
        const result = await TaskCollection.insertOne(user);
        res.send(result);
      });
      app.get('/task/:email', async (req, res) => {
        const mail = req.params.email;
        const query = { 
          email:mail,
          status: "ToDo" };
        const tasks = await TaskCollection.find(query).toArray();
        res.send(tasks);
      });
  
      app.get('/taskgo/:email', async (req, res) => {
        const mail = req.params.email;
        const query = { 
          email:mail,
          status: "ongoing" };
        const tasks = await TaskCollection.find(query).toArray();
        res.send(tasks);
      });
      app.get('/taskcom/:email', async (req, res) => {
        const mail = req.params.email;
        const query = { 
          email:mail,
          status: "complete" };
        const tasks = await TaskCollection.find(query).toArray();
        res.send(tasks);
      });
      app.patch('/tasks/:id', async (req, res) => {
        const item = req.body;
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) }
        const updatedDoc = {
          $set: {
            status:item.status
          }
        }
  
        const result = await TaskCollection.updateOne(filter, updatedDoc)
        res.send(result);
      });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('SERVER is Running');
  
  })
  app.listen(port, () => {
    console.log(` web server is running port${port}`)
  })