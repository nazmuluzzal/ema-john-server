const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;
const port = 5000;
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dtkkw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

// middleware
app.use(cors());
app.use(bodyParser.json());

// mongo db
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const productsCollection = client.db("emaJohnStore").collection("products");
  const ordersCollection = client.db("emaJohnStore").collection("orders");
  // perform actions on the collection object
  app.post("/addProduct", (req, res) => {
    const products = req.body;
    console.log(products);
    //insert many
    productsCollection.insertOne(products).then((result) => {
      // console.log(result);
      console.log(result.insertedCount);
      res.send(result.insertedCount);
    });
    // products.insertOne(product).then((result) => {
    //   console.log(result);
    // });
  });
  // load data from db
  app.get("/products", (req, res) => {
    productsCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  //load single product
  app.get("/product/:key", (req, res) => {
    productsCollection
      .find({ key: req.params.key })
      .toArray((err, documents) => {
        res.send(documents[0]);
      });
  });

  // load some product
  app.post("/productsByKeys", (req, res) => {
    const productKeys = req.body;
    productsCollection
      .find({ key: { $in: productKeys } })
      .toArray((err, documents) => {
        res.send(documents);
      });
  });

  // order collection
  app.post("/addOrder", (req, res) => {
    const order = req.body;
    // console.log(products);
    //insert one
    ordersCollection.insertOne(order).then((result) => {
      // console.log(result);
      //   console.log(result.insertedCount);
      res.send(result.insertedCount > 0);
    });
  });

  console.log("DB connected");
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});
