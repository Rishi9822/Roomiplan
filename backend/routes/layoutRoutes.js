const express = require('express');
const router = express.Router();
const Layout = require('../models/Layout');

const {
  generate1BHKLayout,
  generate2BHKLayout,
  generate3BHKLayout,
  generate2BHKVertical,
  generate2BHKSplit,
  generate3BHKVertical,
  generate3BHKSplit,
  generate1BHKVertical,
  generate1BHKSplit,
} = require('../utils/layoutPresets');

const { generateSmartLayoutInPolygon } = require("../utils/customIrregularLayout");

// POST: Generate and save layout for rectangular plots
router.post('/', async (req, res) => {
  try {
    const { plotLength, plotWidth, houseType, layoutType = 'default' } = req.body;

    let layout;

    if (houseType === '1BHK') {
      if (layoutType === 'vertical') {
        layout = generate1BHKVertical(plotLength, plotWidth);
      } else if (layoutType === 'split') {
        layout = generate1BHKSplit(plotLength, plotWidth);
      } else {
        layout = generate1BHKLayout(plotLength, plotWidth);
      }
    } else if (houseType === '2BHK') {
      if (layoutType === 'vertical') {
        layout = generate2BHKVertical(plotLength, plotWidth);
      } else if (layoutType === 'split') {
        layout = generate2BHKSplit(plotLength, plotWidth);
      } else {
        layout = generate2BHKLayout(plotLength, plotWidth);
      }
    } else if (houseType === '3BHK') {
      if (layoutType === 'vertical') {
        layout = generate3BHKVertical(plotLength, plotWidth);
      } else if (layoutType === 'split') {
        layout = generate3BHKSplit(plotLength, plotWidth);
      } else {
        layout = generate3BHKLayout(plotLength, plotWidth);
      }
    } else {
      return res.status(400).json({ error: 'Unsupported house type' });
    }

    const newLayout = new Layout({
      plotLength,
      plotWidth,
      rooms: layout.map(r => r.name),
      layout,
    });

    await newLayout.save();

    res.status(201).json({
      message: 'Layout saved to DB',
      layout,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: Generate and save layout for irregular polygon plots
router.post('/custom', async (req, res) => {
  try {
    const { sides, frontIndex, houseType } = req.body;

    if (!Array.isArray(sides) || sides.length < 3) {
      return res.status(400).json({ error: "At least 3 sides required" });
    }

    const { layout: roomLayout, polygonPoints } = generateSmartLayoutInPolygon(sides, frontIndex, houseType);

    if (!Array.isArray(roomLayout) || !polygonPoints || polygonPoints.length < 3) {
      return res.status(500).json({ error: "Failed to generate valid layout or polygon points" });
    }

    const finalLayout = [
      { type: "polygon", points: polygonPoints },
      ...roomLayout,
    ];

    const newLayout = new Layout({
      plotLength: null,
      plotWidth: null,
      rooms: roomLayout.map(r => r.name),
      layout: finalLayout,
    });

    await newLayout.save();

    res.status(201).json({
      message: "Irregular layout generated and saved",
      layout: finalLayout,
    });
  } catch (err) {
    console.error("Error generating irregular layout:", err);
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
