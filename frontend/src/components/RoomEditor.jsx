import React, { useState } from "react";
import { Rnd } from "react-rnd";

const roomColors = {
  hall: "#a2d2ff",
  bedroom: "#caffbf",
  kitchen: "#ffd6a5",
  bathroom: "#ffadad",
  parking: "#bdb2ff",
  dining: "#fdffb6",
  store: "#d0f4de",
  study: "#ffc6ff",
};

export default function RoomEditor({ layout, plotLength, plotWidth, onUpdate }) {
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [lockAspectRatio, setLockAspectRatio] = useState(false);

  const SVG_WIDTH = 800;
  const SVG_HEIGHT = 500;
  const xScale = SVG_WIDTH / plotWidth;
  const yScale = SVG_HEIGHT / plotLength;

  const gridX = xScale * 2;
  const gridY = yScale * 2;

  const snap = (value, gridSize) => Math.round(value / gridSize) * gridSize;

  const handleDelete = (index) => {
    const updated = [...layout];
    updated.splice(index, 1);
    onUpdate(index, null); // Trigger delete externally
  };

  return (
    <div style={{ position: "relative", width: SVG_WIDTH, height: SVG_HEIGHT }}>
      {/* Grid Lines */}
      {snapToGrid &&
        [...Array(Math.floor(SVG_WIDTH / gridX))].map((_, i) => (
          <div key={`v${i}`} style={{
            position: "absolute", left: i * gridX, top: 0, width: 1,
            height: SVG_HEIGHT, background: "#ddd", zIndex: 0
          }} />
        ))}
      {snapToGrid &&
        [...Array(Math.floor(SVG_HEIGHT / gridY))].map((_, i) => (
          <div key={`h${i}`} style={{
            position: "absolute", top: i * gridY, left: 0, height: 1,
            width: SVG_WIDTH, background: "#ddd", zIndex: 0
          }} />
        ))}

      {/* Feature Toggles */}
      <div className="absolute z-10 top-2 left-2 flex gap-4 bg-white/90 p-2 rounded-xl shadow">
        <label className="text-sm">
          <input type="checkbox" checked={snapToGrid} onChange={() => setSnapToGrid(!snapToGrid)} className="mr-1" />
          Snap to Grid
        </label>
        <label className="text-sm">
          <input type="checkbox" checked={lockAspectRatio} onChange={() => setLockAspectRatio(!lockAspectRatio)} className="mr-1" />
          Lock Aspect Ratio
        </label>
      </div>

      {/* Rooms with delete support */}
      {layout.map((room, index) =>
        room ? (
          <Rnd
            key={index}
            size={{
              width: room.width * xScale,
              height: room.height * yScale,
            }}
            position={{
              x: room.x * xScale,
              y: room.y * yScale,
            }}
            bounds="parent"
            lockAspectRatio={lockAspectRatio}
            enableResizing={{
              top: true, right: true, bottom: true, left: true,
              topRight: true, bottomRight: true, bottomLeft: true, topLeft: true
            }}
            onDragStop={(e, d) => {
              const x = snapToGrid ? snap(d.x, gridX) : d.x;
              const y = snapToGrid ? snap(d.y, gridY) : d.y;
              onUpdate(index, { ...room, x: x / xScale, y: y / yScale });
            }}
            onResizeStop={(e, dir, ref, delta, pos) => {
              const w = snapToGrid ? snap(ref.offsetWidth, gridX) : ref.offsetWidth;
              const h = snapToGrid ? snap(ref.offsetHeight, gridY) : ref.offsetHeight;
              const x = snapToGrid ? snap(pos.x, gridX) : pos.x;
              const y = snapToGrid ? snap(pos.y, gridY) : pos.y;
              onUpdate(index, { ...room, width: w / xScale, height: h / yScale, x: x / xScale, y: y / yScale });
            }}
          >
            <div
  style={{
    width: "100%",
    height: "100%",
    background: roomColors[room.name.toLowerCase()] || "#ddd",
    border: "2px solid #000",
    borderRadius: "4px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
    position: "relative",
    boxSizing: "border-box",
  }}
>
  {/* 🟢 Room Name */}
  {room.name}

  {/* 📏 Dimension Label */}
  <div
    style={{
      position: "absolute",
      bottom: 4,
      right: 6,
      fontSize: "10px",
      color: "#000",
      background: "#fff",
      padding: "1px 4px",
      borderRadius: "3px",
    }}
  >
    {room.width.toFixed(1)} x {room.height.toFixed(1)} ft
  </div>

  {/* ❌ Delete Button */}
  <button
    onClick={() => onUpdate(index, null)}
    style={{
      position: "absolute",
      top: 4,
      right: 4,
      background: "#ff4d4f",
      border: "none",
      borderRadius: "50%",
      width: "20px",
      height: "20px",
      color: "white",
      fontSize: "14px",
      cursor: "pointer",
      zIndex: 999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 0 4px rgba(0,0,0,0.3)",
    }}
    title="Delete Room"
  >
    ×
  </button>
</div>

          </Rnd>
        ) : null
      )}
    </div>
  );
}
