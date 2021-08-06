const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const port = process.env.PORT || 5055;

const { MongoClient } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jwvev.mongodb.net/${process.env.NAME}?retryWrites=true&w=majority`;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World...");
});

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const productsCollection = client.db("sportsSnap").collection("events");
  const cartsCollection = client.db("sportsSnap").collection("carts");
  const ordersCollection = client.db("sportsSnap").collection("orders");
  console.log("DataBase Connected.");

  app.get("/events", (req, res) => {
    productsCollection.find({}).toArray((err, items) => {
      res.send(items);
    });
  });

  app.get("/carts", (req, res) => {
    cartsCollection.find({}).toArray((err, items) => {
      res.send(items);
    });
  });

  app.post("/addOrder", (req, res) => {
    const order = req.body;
    console.log(order);
    ordersCollection.insertOne(order).then((result) => {
      res.send(result);
    });
  });

  app.post("/addEvent", (req, res) => {
    const newEvent = req.body;
    productsCollection.insertOne(newEvent).then((result) => {
      res.send(result.acknowledged > 0);
    });
  });

  app.post("/addCart", (req, res) => {
    const newEvent = req.body;
    cartsCollection.insertOne(newEvent).then((result) => {
      res.send(result.acknowledged > 0);
    });
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
