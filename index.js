const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.gvfpmor.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
const express = require("express");
const app = express();

const port = process.env.PORT || 5000;

async function run() {
  try {
    await client.connect();

    const collection = client.db("portfolio").collection("projects");

    app.get("/", (req, res) => {
      res.send("JWT BE running");
    });

    app.get("/projects", async (req, res) => {
      const query = {};
      const cursor = collection.find(query);
      const projects = await cursor.toArray();
      res.send(projects);
    });
  } finally {
  }
}
run().catch(console.dir);
app.listen(port, () => {
  console.log("listening on port " + port);
});
