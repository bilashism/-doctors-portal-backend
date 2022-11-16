const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

dotenv.config();
const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());
// const verifyToken = (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader) {
//     return res.status(401).send({ message: "Unauthorized access" });
//   }
//   const token = authHeader.split(" ").pop();
//   jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
//     if (err) {
//       return res.status(403).send({ message: "Forbidden access" });
//     }
//     req.decoded = decoded;
//     next();
//   });
// };

// localhost server setup
const server = app.listen(port, "localhost", () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log(`🌐 Running at: http://${host}:${port}`);
});

// server root
app.get("/", (req, res) => {
  res.sendStatus(200);
});

// integrate mongoDB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PWD}@${process.env.DB_CLUSTER_URL}/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1
});

const run = async () => {
  try {
    const database = client.db("doctorsPortal");

    // app.post("/jwt", async (req, res) => {
    //   const userEmail = req.body;
    //   const token = jwt.sign(userEmail, process.env.ACCESS_TOKEN, {
    //     expiresIn: "10h"
    //   });
    //   res.send({ token });
    // });

    const appointmentOptionsCollection =
      database.collection("appointmentOptions");

    app.get("/appointmentOptions", async (req, res) => {
      const query = {};
      const options = {};
      const result = await appointmentOptionsCollection
        .find(query, options)
        .toArray();
      res.send(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
};
run().catch(console.dir);
