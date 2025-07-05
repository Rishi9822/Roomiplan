import React, { useState, useEffect } from "react";
import { Rnd } from "react-rnd";

export default function RoomMap({ layout, plotLength, plotWidth, polygon = [], editMode }) {
  if (!layout || layout.length === 0) return <p>No layout to display.</p>;

  const SVG_WIDTH = 800;
  const SVG_HEIGHT = 500;

  const isPolygon = polygon && Array.isArray(polygon) && polygon.length >= 3;

  const boundingBox = isPolygon
    ? {
        minX: Math.min(...polygon.map((p) => p?.x ?? 0)),
        maxX: Math.max(...polygon.map((p) => p?.x ?? 0)),
        minY: Math.min(...polygon.map((p) => p?.y ?? 0)),
        maxY: Math.max(...polygon.map((p) => p?.y ?? 0)),
      }
    : null;

  const xScale = isPolygon
    ? SVG_WIDTH / (boundingBox.maxX - boundingBox.minX || 1)
    : SVG_WIDTH / (plotWidth || 1);

  const yScale = isPolygon
    ? SVG_HEIGHT / (boundingBox.maxY - boundingBox.minY || 1)
    : SVG_HEIGHT / (plotLength || 1);

  const offsetX = isPolygon ? boundingBox.minX : 0;
  const offsetY = isPolygon ? boundingBox.minY : 0;

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

  const [localRooms, setLocalRooms] = useState(layout);

  useEffect(() => {
    setLocalRooms(layout);
  }, [layout]);

  const handleUpdate = (index, newX, newY, newW, newH) => {
    const updated = [...localRooms];
    updated[index] = {
      ...updated[index],
      x: newX / xScale + offsetX,
      y: newY / yScale + offsetY,
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
      {/* Grid Lines */}
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

      {/* Polygon Background */}
      {isPolygon && (
        <svg
          width="100%"
          height="100%"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 0,
          }}
        >
          <polygon
            points={polygon
              .map((p) => {
                if (typeof p.x !== "number" || typeof p.y !== "number") return null;
                const x = (p.x - offsetX) * xScale;
                const y = (p.y - offsetY) * yScale;
                return `${x},${y}`;
              })
              .filter(Boolean)
              .join(" ")}
            fill="rgba(99,102,241,0.08)"
            stroke="#4F46E5"
            strokeWidth="2"
          />
        </svg>
      )}

      {/* Room Boxes */}
      {localRooms.map((room, index) => {
        const color = roomColors[room.name?.toLowerCase()] || "#ddd";

        const x = (room.x - offsetX) * xScale;
        const y = (room.y - offsetY) * yScale;
        const width = room.width * xScale;
        const height = room.height * yScale;

        if ([x, y, width, height].some((v) => isNaN(v))) return null;

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
              zIndex: 1,
            }}
          >
            {room.name}
          </div>
        );
      })}
    </div>
  );
}
