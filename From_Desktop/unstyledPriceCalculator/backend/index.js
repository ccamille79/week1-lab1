//https://stackoverflow.com/questions/5823722/how-to-serve-an-image-using-nodejs

var path = require('path');
var express = require('express');
var app = express();

// The database
//const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const { MongoClient } = require("mongodb");
const uri = "mongodb://127.0.0.1:27017";

const app = express();
const port = 8000; // Port de ton site web
const mongoUrl = "mongodb://localhost:27017";
const dbName = "TestDB";

app.use(express.json()); // Pour parser les données JSON

let db;

var options = {
    index: "myWebPage.html"
  };

var dir = path.join(__dirname, '../frontend');

app.get('/api', function(req, res){
    res.send("Yes we have an API now")
});

// e.g. test using:
//http://127.0.0.1:8000/api/getPrice?salary=2000&days=20
app.get('/api/getPrice', function(req, res){
    //res.send("Hello world!")
    // Copied from front end
    var s = req.query.salary;
    var d = req.query.days;
    console.log("Calculating price")
    console.log(s)
    console.log(d)
    let finalPrice = 0;
    dailyRate = s/365;
    price = Math.round(dailyRate * d);
    var roundToNearest = 50;
    roundedPrice = Math.round((price+roundToNearest)/roundToNearest) * roundToNearest // Always round up
    res.send(""+roundedPrice)
});

app.get('/api/storeQuote', function(req, res){
    //res.send("Hello world!")
    // Copied from front end
    var n = req.query.quoteName
    var s = req.query.salary;
    var d = req.query.days;
    console.log("Storing quote: "+n+" "+s+" "+d)

    // Connexion MongoDB
MongoClient.connect(mongoUrl, { useUnifiedTopology: true })
  .then((client) => {
    db = client.db(dbName);
    console.log("✅ Connecté à MongoDB");

    // Démarre le serveur une fois connecté à MongoDB
    app.listen(port, () => {
      console.log(`🚀 Serveur Express en ligne sur http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("❌ Erreur de connexion à MongoDB:", err);
  });

// ROUTE POST pour enregistrer un utilisateur
app.post('/visiteurs', async (req, res) => {
  try {
    const data = req.body;
    const collection = db.collection('visiteurs');
    const result = await collection.insertOne(data);
    res.status(201).json({ message: 'Donnée insérée', id: result.insertedId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ROUTE GET pour consulter les visiteurs
app.get('/visiteurs', async (req, res) => {
  try {
    const collection = db.collection('visiteurs');
    const visiteurs = await collection.find().toArray();
    res.json(visiteurs);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des données' });
  }
});

    
});