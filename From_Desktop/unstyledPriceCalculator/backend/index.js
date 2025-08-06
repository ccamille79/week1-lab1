const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 8000;
const mongoUrl = "mongodb://localhost:27017";
const dbName = "monSiteDB";

app.use(express.json());

let db;

MongoClient.connect(mongoUrl, { useUnifiedTopology: true })
  .then((client) => {
    db = client.db(dbName);
    console.log("✅ Connecté à MongoDB");

    // On ne lance le serveur qu'après la connexion
    app.listen(port, () => {
      console.log(`🚀 Serveur démarré sur http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("❌ Erreur de connexion à MongoDB:", err);
  });

// ✅ Route POST pour ajouter un visiteur
app.post('/visiteurs', async (req, res) => {
  try {
    const result = await db.collection('visiteurs').insertOne(req.body);
    res.status(201).json({ id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de l’insertion' });
  }
});

// ✅ Route GET pour récupérer tous les visiteurs
app.get('/visiteurs', async (req, res) => {
  try {
    const visiteurs = await db.collection('visiteurs').find().toArray();
    res.json(visiteurs);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération' });
  }
});