import React, { useState } from "react";
import { Rnd } from "react-rnd";

export default function RoomMap({ layout, plotLength, plotWidth, editMode }) {
  if (!layout || layout.length === 0) return <p>No layout to display.</p>;

  const SVG_WIDTH = 800;
  const SVG_HEIGHT = 500;

  const isPolygon = Array.isArray(layout) && layout[0]?.type === "polygon";
  const polygonPoints = isPolygon ? layout[0].points : [];
  const rooms = isPolygon ? layout.slice(1) : layout;

  const boundingBox = isPolygon
    ? {
        minX: Math.min(...polygonPoints.map(p => p.x)),
        maxX: Math.max(...polygonPoints.map(p => p.x)),
        minY: Math.min(...polygonPoints.map(p => p.y)),
        maxY: Math.max(...polygonPoints.map(p => p.y)),
      }
    : null;

  const xScale = isPolygon
    ? SVG_WIDTH / (boundingBox.maxX - boundingBox.minX)
    : SVG_WIDTH / plotWidth;
  const yScale = isPolygon
    ? SVG_HEIGHT / (boundingBox.maxY - boundingBox.minY)
    : SVG_HEIGHT / plotLength;

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

  const [localRooms, setLocalRooms] = useState(rooms);

  const handleUpdate = (index, newX, newY, newW, newH) => {
    const updated = [...localRooms];
    updated[index] = {
      ...updated[index],
      x: newX / xScale + (isPolygon ? boundingBox.minX : 0),
      y: newY / yScale + (isPolygon ? boundingBox.minY : 0),
      width: newW / xScale,
      height: newH / yScale,
    };
    setLocalRooms(updated);
  };

  return (
    <div
      style={{
        border: "4px solid #444",
        marginTop: "20px",
        width: SVG_WIDTH,
        height: SVG_HEIGHT,
        position: "relative",
        background: "#f9f9f9",
      }}
    >
      {/* Grid */}
      {[...Array(20)].map((_, i) => (
        <div
          key={`h${i}`}
          style={{
            position: "absolute",
            top: `${(SVG_HEIGHT / 20) * i}px`,
            left: 0,
            width: SVG_WIDTH,
            height: 1,
            background: "#eee",
          }}
        />
      ))}
      {[...Array(20)].map((_, i) => (
        <div
          key={`v${i}`}
          style={{
            position: "absolute",
            left: `${(SVG_WIDTH / 20) * i}px`,
            top: 0,
            width: 1,
            height: SVG_HEIGHT,
            background: "#eee",
          }}
        />
      ))}

      {/* Polygon Shape Outline */}
      {isPolygon && polygonPoints && (
        <svg
          width={SVG_WIDTH}
          height={SVG_HEIGHT}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            pointerEvents: "none",
          }}
        >
          <polygon
            points={polygonPoints
              .map(p => `${(p.x - boundingBox.minX) * xScale},${(p.y - boundingBox.minY) * yScale}`)
              .join(" ")}
            fill="rgba(0, 0, 0, 0.05)"
            stroke="black"
            strokeWidth={2}
          />
        </svg>
      )}

      {/* Rooms */}
      {localRooms.map((room, index) => {
        const color = roomColors[room.name?.toLowerCase()] || "#ddd";
        const x = (room.x - (isPolygon ? boundingBox.minX : 0)) * xScale;
        const y = (room.y - (isPolygon ? boundingBox.minY : 0)) * yScale;
        const width = room.width * xScale;
        const height = room.height * yScale;

        return editMode ? (
          <Rnd
            key={index}
            size={{ width, height }}
            position={{ x, y }}
            bounds="parent"
            onDragStop={(e, d) => {
              handleUpdate(index, d.x, d.y, width, height);
            }}
            onResizeStop={(e, direction, ref, delta, position) => {
              handleUpdate(index, position.x, position.y, ref.offsetWidth, ref.offsetHeight);
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: color,
                border: "2px solid #333",
                borderRadius: "4px",
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontWeight: "bold",
              }}
            >
              <span>{room.name}</span>
              <div
                style={{
                  position: "absolute",
                  top: -20,
                  left: 4,
                  background: "#000",
                  color: "#fff",
                  fontSize: "10px",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  opacity: 0.9,
                }}
              >
                {`${room.width.toFixed(1)} x ${room.height.toFixed(1)} ft`}
              </div>
            </div>
          </Rnd>
        ) : (
          <div
            key={index}
            style={{
              position: "absolute",
              top: y,
              left: x,
              width,
              height,
              background: color,
              border: "4px solid #222",
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: 14,
            }}
          >
            {room.name}
          </div>
        );
      })}
    </div>
  );
}
