require('dotenv').config();

const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const shortId = require('shortid');
const opn = require('opn');


// Connection URL
const url = process.env.DB_URL;

// Database Name
const dbName = 'urlshort';

// Parse the MongoDB connection string manually
const urlParts = url.split('/');
const dbNameFromUrl = urlParts.pop();
const dbHost = urlParts.join('/');
const client = new MongoClient(dbHost, { useNewUrlParser: true, useUnifiedTopology: true });

// Connect to the MongoDB server
client.connect(function(err) {
    if (err) {
        console.error('Error connecting to MongoDB:', err);
        return;
    }

    console.log('Connected successfully to MongoDB');

    const db = client.db(dbNameFromUrl || dbName);
    const collection = db.collection('shortUrls');

    // Define routes
    app.set('view engine', 'ejs');
    app.use(express.urlencoded({ extended: false }));

    app.get('/', async (req, res) => {
        const shortUrls = await collection.find().toArray();
        res.render('index', { shortUrls: shortUrls });
    });

    app.post('/shortUrls', async (req, res) => {
        const fullUrl = req.body.fullUrl;
        const shortUrl = shortId.generate();
        await collection.insertOne({ full: fullUrl, short: shortUrl, clicks: 0 });
        res.redirect('/');
    });

    app.get('/:shortUrl', async (req, res) => {
        const shortUrl = await collection.findOne({ short: req.params.shortUrl });
        if (shortUrl == null) return res.sendStatus(404);

        shortUrl.clicks++;
        await collection.updateOne({ short: req.params.shortUrl }, { $set: { clicks: shortUrl.clicks } });

        res.redirect(shortUrl.full);
    });

    app.listen(process.env.PORT || 4000, () => {
        console.log('Server running on port 4000');
        opn('http://localhost:4000');
    });
});

