import React, { useState } from "react";
import { Rnd } from "react-rnd";

export default function RoomMap({ layout, plotLength, plotWidth, editMode }) {
  if (!layout || layout.length === 0) return <p>No layout to display.</p>;

  const SVG_WIDTH = 800;
  const SVG_HEIGHT = 500;
  const xScale = SVG_WIDTH / plotWidth;
  const yScale = SVG_HEIGHT / plotLength;

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

  const [rooms, setRooms] = useState(layout);

  const handleUpdate = (index, newX, newY, newW, newH) => {
    const updated = [...rooms];
    updated[index] = {
      ...updated[index],
      x: newX / xScale,
      y: newY / yScale,
      width: newW / xScale,
      height: newH / yScale,
    };
    setRooms(updated);
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
      {/* Grid background */}
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

      {/* Rooms */}
      {rooms.map((room, index) => {
        const color = roomColors[room.name.toLowerCase()] || "#ddd";
        const x = room.x * xScale;
        const y = room.y * yScale;
        const width = room.width * xScale;
        const height = room.height * yScale;

        return editMode ? (
          // <Rnd
          //   key={index}
          //   size={{ width, height }}
          //   position={{ x, y }}
          //   bounds="parent"
          //   onDragStop={(e, d) => handleUpdate(index, d.x, d.y, width, height)}
          //   onResizeStop={(e, dir, ref, delta, pos) => {
          //     handleUpdate(index, pos.x, pos.y, ref.offsetWidth, ref.offsetHeight);
          //   }}
          //   style={{
          //     border: "2px solid #333",
          //     background: color,
          //     display: "flex",
          //     alignItems: "center",
          //     justifyContent: "center",
          //     fontWeight: "bold",
          //     fontSize: "14px",
          //   }}
          // >
          //   {room.name}
          // </Rnd>
          <Rnd
            key={index}
            size={{ width: room.width * xScale, height: room.height * yScale }}
            position={{ x: room.x * xScale, y: room.y * yScale }}
            bounds="parent"
            onDragStop={(e, d) => {
              onRoomUpdate(index, {
                ...room,
                x: d.x / xScale,
                y: d.y / yScale,
              });
            }}
            onResizeStop={(e, direction, ref, delta, position) => {
              onRoomUpdate(index, {
                ...room,
                width: ref.offsetWidth / xScale,
                height: ref.offsetHeight / yScale,
                x: position.x / xScale,
                y: position.y / yScale,
              });
            }}
          >
            {/* Room Box Code */}


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

              {/* ➕ Add this Floating Label for Dimensions */}
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
