const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();


const app = express();
app.use(bodyParser.json());
app.use(cors());

const user = process.env.DB_USER;
const pass = process.env.DB_PASS;

const uri = `mongodb+srv://${user}:${pass}@cluster0.g1juc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

app.get('/',(req,res) => {
    res.send('Hello World')
});

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("emaJhonStore").collection("products");
  const OrderCollection = client.db("emaJhonStore").collection("orders");
  console.log('database connected');

  app.post('/addProduct',(req, res)=>{
      const products = req.body;
      collection.insertOne(products)
      .then(result=>{
          res.send(result.insertedCount)
      })
  });

  app.get('/products',(req, res)=>{
      collection.find({}).limit(20)
      .toArray((err,documents)=>{
          res.send(documents)
      })
  });
  app.get('/product/:key',(req, res)=>{
        collection.find({key:req.params.key})
        .toArray((err,documents)=>{
            res.send(documents[0])
        })
    });
    app.post('/productsByKey',(req, res)=>{
        const productKeys = req.body;
        collection.find({key: { $in: productKeys } })
        .toArray((err,documents)=>{
            res.send(documents)
        })
    });
    app.post('/addOrder',(req, res)=>{
        const orders = req.body;
        OrderCollection.insertOne(orders)
        .then(result=>{
            res.send(result.insertedCount > 0 )
        })
    });
});



app.listen(4000);