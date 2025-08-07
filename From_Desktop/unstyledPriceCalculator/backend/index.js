const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const port = 8080;
const mongoUrl = "mongodb://mongodb:27017/mydatabase";
const mongoUri = "mongodb://localhost:27017/mydatabase";
const dbName = "monSiteDB";

app.use(express.json());

let db;

mongoose.connect(mongoUrl, { useUnifiedTopology: true })
  .then(() => {
    console.log("✅ Connecté à MongoDB");

    // On ne lance le serveur qu'après la connexion
    app.listen(port, () => {
      console.log(`🚀 Serveur démarré sur http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("❌ Erreur de connexion à MongoDB:", err);
  });

app.get('/', (req, res) => {
  res.sendFile('myWebPage.html', { root: path.join(__dirname, '../frontend') });
});
 
const VisiteurSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
 
const Visiteur = mongoose.model('Visiteur', VisiteurSchema);

// ✅ Route POST pour ajouter un visiteur
/*app.post('/visiteurs', async (req, res) => {
  try {
    const result = await db.collection('visiteurs').insertOne(req.body);
    res.status(201).json({ id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de l’insertion' });
  }
});*/
app.post('/visiteurs', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }    

    const visiteur = new Visiteur({ name, email, password });
    await visiteur.save();
 
    res.status(201).json(visiteur);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});


// ✅ Route GET pour récupérer tous les visiteurs
/*app.get('/visiteurs', async (req, res) => {
  try {
    const visiteurs = await db.collection('visiteurs').find().toArray();
    res.json(visiteurs);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération' });
  }
});*/

app.get('/visiteurs', async (req, res) => {
  try {
    console.log("Tentative de recuperation des utilisateurs");	
    const visiteurs = await Visiteur.find();
    res.json(visiteurs);
  } catch (error) {
    console.log(error);  
    res.status(500).json({ message: 'Server error', error });
  }
});
