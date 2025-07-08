import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import RoomEditor from "./components/RoomEditor";
import RoomMap from "./components/RoomMap";
import RoomToolbox from "./components/RoomToolbox";
import PolygonPlotMap from "./components/PolygonPlotMap";

import { motion, AnimatePresence } from "framer-motion";

export default function App() {
  const [preset, setPreset] = useState("2BHK");
  const [plotLength, setPlotLength] = useState(30);
  const [plotWidth, setPlotWidth] = useState(20);
  const [layout, setLayout] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editableLayout, setEditableLayout] = useState([]);
  const [selectedLayoutType, setSelectedLayoutType] = useState("default");
  const [layoutPolygon, setLayoutPolygon] = useState([]);

  const [customPlotSides, setCustomPlotSides] = useState(4);
  const [customSideLengths, setCustomSideLengths] = useState([10, 20, 10, 20]);
  const [customFrontSideIndex, setCustomFrontSideIndex] = useState(0);
  const [polygon, setPolygon] = useState([]);
  useEffect(() => {
    if (layout?.[0]?.type === "polygon") {
      setEditableLayout(layout.slice(1));
    } else {
      setEditableLayout([...layout]);
    }
  }, [layout]);

  const onRoomUpdate = (index, updatedRoom) => {
    const updated = [...editableLayout];
    if (updatedRoom === null) {
      updated.splice(index, 1);
    } else if (index === "full") {
      setEditableLayout(updatedRoom);
      return;
    } else {
      updated[index] = updatedRoom;
    }
    setEditableLayout(updated);
  };

  const handleGenerate = async () => {
  try {
    setLayout([]);
    setEditableLayout([]);
    setPolygon([]); // always reset before new layout

    let res = null;

    if (selectedLayoutType === "custom") {
      const numericSides = customSideLengths.map((length) => Number(length));

      // Validation (optional but helps avoid empty polygons)
      if (numericSides.length < 3 || numericSides.some(isNaN)) {
        alert("Please enter at least 3 valid side lengths.");
        return;
      }

      res = await axios.post("http://localhost:5000/api/layout/custom", {
        sides: numericSides.map((length) => ({ length })),
        frontIndex: customFrontSideIndex,
        houseType: preset,
      });
    } else {
      // Rectangular or preset layouts
      res = await axios.post("http://localhost:5000/api/layout", {
        plotLength,
        plotWidth,
        houseType: preset,
        layoutType: selectedLayoutType,
      });
    }

    const dataLayout = res?.data?.layout;
    const polygonPoints = res?.data?.polygonPoints || [];

    if (!Array.isArray(dataLayout)) {
      throw new Error("Invalid layout format received from server.");
    }

    setLayout(dataLayout);
    setEditMode(false);

    // ✅ Only set polygon data if it's custom layout
    if (selectedLayoutType === "custom" && polygonPoints.length >= 3) {
      // Extra validation to avoid NaN error
      const isValidPolygon = polygonPoints.every(
        (p) => typeof p.x === "number" && typeof p.y === "number" && !isNaN(p.x) && !isNaN(p.y)
      );

      if (isValidPolygon) {
        setPolygon(polygonPoints);
      } else {
        console.warn("⚠️ Invalid polygon points received:", polygonPoints);
        setPolygon([]);
      }
    } else {
      setPolygon([]); // Ensure old polygon doesn't persist
    }
  } catch (err) {
    console.error("❌ Error generating layout:", err);
    alert("Layout generation failed. Please check plot dimensions or try again.");
  }
};



  const handleAddRoom = () => {
    const newRoom = {
      name: "New Room",
      x: 0,
      y: 0,
      width: 5,
      height: 5,
    };
    setEditableLayout((prev) => [...prev, newRoom]);
    setEditMode(true);
  };

  const handleDropRoomFromToolbox = useCallback((roomType) => {
    const newRoom = {
      name: roomType,
      x: 0,
      y: 0,
      width: 5,
      height: 5,
    };
    setEditableLayout((prev) => [...prev, newRoom]);
    setEditMode(true);
  }, []);

  const renderCustomPlotInputs = () => {
    return (
      <div className="col-span-2 grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="text-md font-medium text-gray-700">Number of Sides</label>
          <input
            type="number"
            min={3}
            value={customPlotSides}
            onChange={(e) => {
              const count = parseInt(e.target.value);
              setCustomPlotSides(count);
              setCustomSideLengths(Array(count).fill(10));
            }}
            className="w-full px-3 py-2 rounded border"
          />
        </div>

        {customSideLengths.map((length, index) => (
          <div key={index}>
            <label className="text-sm text-gray-600">Side {index + 1} Length</label>
            <input
              type="number"
              value={length}
              onChange={(e) => {
                const updated = [...customSideLengths];
                updated[index] = parseFloat(e.target.value);
                setCustomSideLengths(updated);
              }}
              className="w-full px-2 py-1 rounded border"
            />
          </div>
        ))}

        <div className="col-span-2">
          <label className="text-sm text-gray-700">Front Side Index (0-based)</label>
          <input
            type="number"
            value={customFrontSideIndex}
            onChange={(e) => setCustomFrontSideIndex(Number(e.target.value))}
            className="w-full px-3 py-2 rounded border"
          />
        </div>
      </div>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 flex justify-center items-center p-6">
        <motion.div
          className="w-full max-w-6xl bg-white/80 backdrop-blur-md shadow-2xl rounded-3xl p-8 border border-white/40"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.h1
            className="text-4xl md:text-5xl font-extrabold text-center text-gray-800 mb-10"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            🏠 <span className="text-purple-600">RoomiPlan</span> Designer
          </motion.h1>

          <motion.div className="grid md:grid-cols-4 gap-6 mb-10">
            <div className="flex flex-col">
              <label className="text-lg font-semibold text-gray-700 mb-1">House Type</label>
              <select
                value={preset}
                onChange={(e) => setPreset(e.target.value)}
                className="px-4 py-2 rounded-xl border border-gray-300 shadow-sm"
              >
                <option value="1BHK">1BHK</option>
                <option value="2BHK">2BHK</option>
                <option value="3BHK">3BHK</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-lg font-semibold text-gray-700 mb-1">Layout Style</label>
              <select
                value={selectedLayoutType}
                onChange={(e) => setSelectedLayoutType(e.target.value)}
                className="px-4 py-2 rounded-xl border border-gray-300 shadow-sm"
              >
                <option value="default">Default</option>
                <option value="vertical">Vertical Stack</option>
                <option value="split">Split Columns</option>
                <option value="custom">Irregular Plot (Custom)</option>
              </select>
            </div>

            {selectedLayoutType === "custom" ? renderCustomPlotInputs() : (
              <div className="flex flex-col md:flex-row gap-4 items-center col-span-2">
                <div className="flex flex-col w-full">
                  <label className="text-lg font-semibold text-gray-700 mb-1">Plot Length</label>
                  <input
                    type="number"
                    value={plotLength}
                    onChange={(e) => setPlotLength(Number(e.target.value))}
                    className="px-4 py-2 rounded-xl border border-gray-300 shadow-sm"
                  />
                </div>
                <div className="flex flex-col w-full">
                  <label className="text-lg font-semibold text-gray-700 mb-1">Plot Width</label>
                  <input
                    type="number"
                    value={plotWidth}
                    onChange={(e) => setPlotWidth(Number(e.target.value))}
                    className="px-4 py-2 rounded-xl border border-gray-300 shadow-sm"
                  />
                </div>
              </div>
            )}
          </motion.div>

          <div className="flex flex-wrap justify-between mb-6 gap-4">
            <motion.button
              onClick={handleGenerate}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-2 rounded-xl font-semibold shadow-md"
            >
              🔄 Generate Layout
            </motion.button>

            <motion.button
              onClick={() => setEditMode(!editMode)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`$${editMode ? "bg-red-500 bg-red-600" : "bg-blue-500 bg-blue-600"} text-black px-6 py-2 rounded-xl font-semibold`}
            >
              {editMode ? "❌ Exit Edit Mode" : "✏️ Edit Layout"}
            </motion.button>

            <motion.button
              onClick={handleAddRoom}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-xl font-semibold shadow-md"
            >
              ➕ Add Room
            </motion.button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={editMode ? "editor" : "map"}
              className="flex gap-6"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
            >
              {editMode && (
                <div className="flex-shrink-0">
                  <RoomToolbox onDropRoom={handleDropRoomFromToolbox} />
                </div>
              )}

              <div>
                {editMode ? (
                  <RoomEditor
                    layout={editableLayout}
                    plotLength={plotLength}
                    plotWidth={plotWidth}
                    onUpdate={onRoomUpdate}
                    onDropNewRoom={handleDropRoomFromToolbox}
                  />
                ) : selectedLayoutType === "custom" ? (
                  <RoomMap layout={layout} plotLength={30} plotWidth={30} editMode={false} polygon={selectedLayoutType === "custom" ? polygon : []} />
                ) : (
                  <RoomMap layout={layout} plotLength={plotLength} plotWidth={plotWidth} editMode={false} polygon={polygon} />
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </DndProvider>
  );
}
