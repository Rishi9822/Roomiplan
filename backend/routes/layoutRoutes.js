const express = require('express');
const router = express.Router();
const Layout = require('../models/Layout');
const generateRoomLayout = require('../utils/generateLayout');

router.post('/', async (req, res) => {
  try {
    const { plotLength, plotWidth, rooms } = req.body;

    const layout = generateRoomLayout(plotLength, plotWidth, rooms);

    const newLayout = new Layout({
      plotLength,
      plotWidth,
      rooms,
      layout,
    });

    await newLayout.save();

    // ✅ Send the generated layout in the response
    res.status(201).json({
      message: 'Layout saved to DB',
      layout: layout,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
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
