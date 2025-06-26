// src/components/RoomEditor.jsx
import React from "react";
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
  const SVG_WIDTH = 800;
  const SVG_HEIGHT = 500;
  const xScale = SVG_WIDTH / plotWidth;
  const yScale = SVG_HEIGHT / plotLength;

  return (
    <div style={{ position: "relative", width: SVG_WIDTH, height: SVG_HEIGHT, border: "2px solid #444" }}>
      {layout.map((room, index) => (
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
          enableResizing={{
            top: true,
            right: true,
            bottom: true,
            left: true,
            topRight: true,
            bottomRight: true,
            bottomLeft: true,
            topLeft: true,
          }}
          onDragStop={(e, d) => {
            const newX = d.x / xScale;
            const newY = d.y / yScale;
            const updated = { ...room, x: newX, y: newY };
            onUpdate(index, updated);
          }}
          onResizeStop={(e, direction, ref, delta, position) => {
            const newWidth = ref.offsetWidth / xScale;
            const newHeight = ref.offsetHeight / yScale;
            const newX = position.x / xScale;
            const newY = position.y / yScale;
            const updated = { ...room, width: newWidth, height: newHeight, x: newX, y: newY };
            onUpdate(index, updated);
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              background: roomColors[room.name.toLowerCase()] || "#ddd",
              border: "2px solid #000",
              borderRadius: "4px",
              position: "relative",
              boxSizing: "border-box",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: "bold",
            }}
          >
            {room.name}
            <div
              style={{
                position: "absolute",
                bottom: 2,
                right: 4,
                fontSize: "10px",
                color: "#000",
                background: "#fff",
                padding: "1px 4px",
                borderRadius: "3px",
              }}
            >
              {room.width.toFixed(1)} x {room.height.toFixed(1)} ft
            </div>
          </div>
        </Rnd>
      ))}
    </div>
  );
}
