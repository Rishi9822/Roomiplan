// backend/routes/layoutRoutes.js

const express = require('express');
const Layout = require('../models/Layout');

const router = express.Router();

// POST: Save a layout
router.post('/', async (req, res) => {
  try {
    const { plotLength, plotWidth, rooms } = req.body;

    const newLayout = new Layout({ plotLength, plotWidth, rooms });
    await newLayout.save();

    res.status(201).json({ message: 'Layout saved to DB' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save layout' });
  }
});

// GET: Fetch all layouts
router.get('/', async (req, res) => {
  try {
    const layouts = await Layout.find();
    res.status(200).json(layouts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch layouts' });
  }
});

module.exports = router;
