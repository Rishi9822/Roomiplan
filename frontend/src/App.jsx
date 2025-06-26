import React, { useState, useEffect } from "react";
import axios from "axios";
import RoomMap from "./components/RoomMap";
import RoomEditor from "./components/RoomEditor";
import { motion, AnimatePresence } from "framer-motion";

export default function App() {
  const [preset, setPreset] = useState("2BHK");
  const [plotLength, setPlotLength] = useState(30);
  const [plotWidth, setPlotWidth] = useState(20);
  const [layout, setLayout] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editableLayout, setEditableLayout] = useState([]);
  const [selectedLayoutType, setSelectedLayoutType] = useState("default");

  // Sync editable layout with new layout
  useEffect(() => {
    setEditableLayout([...layout]);
  }, [layout]);

  const onRoomUpdate = (index, updatedRoom) => {
    const updated = [...editableLayout];
    updated[index] = updatedRoom;
    setEditableLayout(updated);
  };

  const handleGenerate = async () => {
    try {
      setLayout([]); // Clear current layout
      setEditableLayout([]); // Reset editable layout

      const res = await axios.post("http://localhost:5000/api/layout", {
        plotLength,
        plotWidth,
        houseType: preset,
        layoutType: selectedLayoutType,
      });

      const generated = res.data.layout;
      setLayout(generated);
      setEditMode(false);
    } catch (err) {
      console.error("Error generating layout:", err.message);
    }
  };

  return (
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

        {/* Control Panel */}
        <motion.div
          className="grid md:grid-cols-4 gap-6 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* House Type */}
          <div className="flex flex-col">
            <label className="text-lg font-semibold text-gray-700 mb-1">House Type</label>
            <select
              value={preset}
              onChange={(e) => setPreset(e.target.value)}
              className="px-4 py-2 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            >
              <option value="1BHK">1BHK</option>
              <option value="2BHK">2BHK</option>
              <option value="3BHK">3BHK</option>
            </select>
          </div>

          {/* Layout Style */}
          <div className="flex flex-col">
            <label className="text-lg font-semibold text-gray-700 mb-1">Layout Style</label>
            <select
              value={selectedLayoutType}
              onChange={(e) => setSelectedLayoutType(e.target.value)}
              className="px-4 py-2 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            >
              <option value="default">Default</option>
              <option value="vertical">Vertical Stack</option>
              <option value="split">Split Columns</option>
            </select>
          </div>

          {/* Plot Dimensions */}
          <div className="flex flex-col md:flex-row gap-4 items-center col-span-2">
            <div className="flex flex-col w-full">
              <label className="text-lg font-semibold text-gray-700 mb-1">Plot Length</label>
              <input
                type="number"
                value={plotLength}
                onChange={(e) => setPlotLength(Number(e.target.value))}
                className="px-4 py-2 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition w-full"
              />
            </div>
            <div className="flex flex-col w-full">
              <label className="text-lg font-semibold text-gray-700 mb-1">Plot Width</label>
              <input
                type="number"
                value={plotWidth}
                onChange={(e) => setPlotWidth(Number(e.target.value))}
                className="px-4 py-2 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition w-full"
              />
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
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
            className={`${
              editMode
                ? "bg-red-500 hover:bg-red-600"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white px-6 py-2 rounded-xl font-semibold transition duration-300`}
          >
            {editMode ? "❌ Exit Edit Mode" : "✏️ Edit Layout"}
          </motion.button>
        </div>

        {/* Layout View */}
        <AnimatePresence mode="wait">
          <motion.div
            key={editMode ? "editor" : "map"}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
            className="rounded-2xl border border-dashed border-gray-300 p-6 bg-white/60 shadow-inner overflow-x-auto min-h-[300px]"
          >
            {editMode ? (
              <RoomEditor
                layout={editableLayout}
                plotLength={plotLength}
                plotWidth={plotWidth}
                onUpdate={onRoomUpdate}
              />
            ) : (
              <RoomMap
                layout={layout}
                plotLength={plotLength}
                plotWidth={plotWidth}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
