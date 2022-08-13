const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.gvfpmor.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 5000;

const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader?.split(" ")[1] === "null") {
    return res.status(401).send({ message: "Token Doesn't Match" });
  }

  next();
};

async function run() {
  try {
    await client.connect();

    const collection = client.db("portfolio").collection("projects");
    const usersCollection = client.db("portfolio").collection("users");

    app.get("/", (req, res) => {
      res.send("JWT BE running");
    });

    app.get("/projects", verifyJWT, async (req, res) => {
      const query = {};
      const cursor = collection.find(query);
      const projects = await cursor.toArray();
      res.send(projects);
    });

    app.get("/users", async (req, res) => {
      const users = usersCollection.find({});
      res.send(users.toArray());
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1d",
      });
      res.send({ accessToken });
    });
  } finally {
  }
}
run().catch(console.dir);
app.listen(port, () => {
  console.log("listening on port " + port);
});
