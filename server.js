require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const ListingsDB = require("./modules/listingsDB.js");
const path = require('path');

const db = new ListingsDB();

const app = express();
const cors = require('cors');
const HTTP_PORT = process.env.PORT || 8080;

app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
    res.send({ message: "API Listening" });
});

// app.listen(HTTP_PORT, () => {
//     console.log(`Server listening on port ${HTTP_PORT}`);
// })

db.initialize(process.env.MONGODB_CONN_STRING).then(() => {
    app.listen(HTTP_PORT, () => {
        console.log(`server listening on: ${HTTP_PORT}`);
    });
}).catch((err) => {
    console.log(err);
});

// POST /api/listings
app.post('/api/listings', async (req, res) => {
    try {
      const newListing = await db.addNewListing(req.body);
      res.status(201).json(newListing);
    } catch (err) {
      res.status(500).json({ error: 'Failed to add new listing', details: err.message });
    }
  });
  
// GET /api/listings
app.get('/api/listings', async (req, res) => {
const { page, perPage, name } = req.query;
try {
    const listings = await db.getAllListings(parseInt(page), parseInt(perPage), name);
    res.json(listings);
} catch (err) {
    res.status(500).json({ error: 'Failed to retrieve listings', details: err.message });
}
});
  
// GET /api/listings/:id
app.get('/api/listings/:id', async (req, res) => {
try {
    const listing = await db.getListingById(req.params.id);
    if (listing) {
    res.json(listing);
    } else {
    res.status(404).json({ error: 'Listing not found' });
    }
} catch (err) {
    res.status(500).json({ error: 'Failed to retrieve listing', details: err.message });
}
});
  
// PUT /api/listings/:id
app.put('/api/listings/:id', async (req, res) => {
try {
    const result = await db.updateListingById(req.body, req.params.id);
    if (result.nModified > 0) {
    res.json({ message: 'Listing updated successfully' });
    } else {
    res.status(404).json({ error: 'Listing not found' });
    }
} catch (err) {
    res.status(500).json({ error: 'Failed to update listing', details: err.message });
}
});
  
// DELETE /api/listings/:id
app.delete('/api/listings/:id', async (req, res) => {
try {
    const result = await db.deleteListingById(req.params.id);
    if (result.deletedCount > 0) {
    res.json({ message: 'Listing deleted successfully' });
    } else {
    res.status(404).json({ error: 'Listing not found' });
    }
} catch (err) {
    res.status(500).json({ error: 'Failed to delete listing', details: err.message });
}
});