import React from "react";

export default function RoomMap({ layout, plotLength, plotWidth }) {
  if (!layout || layout.length === 0) return null;

  // Scale to fit SVG viewBox (optional: tweak these values)
  const scale = 20;

  return (
    <svg
      width={plotWidth * scale}
      height={plotLength * scale}
      style={{ border: "2px solid #000", marginTop: "20px" }}
    >
      {layout.map((room, index) => (
        <g key={index}>
          <rect
            x={room.x * scale}
            y={room.y * scale}
            width={room.width * scale}
            height={room.height * scale}
            fill={getRoomColor(room.name)}
            stroke="#333"
            strokeWidth="1"
            rx="4"
          />
          <text
            x={(room.x + room.width / 2) * scale}
            y={(room.y + room.height / 2) * scale}
            fontSize="10"
            textAnchor="middle"
            fill="#fff"
            alignmentBaseline="middle"
          >
            {room.name}
          </text>
        </g>
      ))}
    </svg>
  );
}

function getRoomColor(name) {
  const colorMap = {
    Hall: "#4A90E2",
    Bedroom: "#7ED6DF",
    Bathroom: "#95A5A6",
    Kitchen: "#E67E22",
    Parking: "#F1C40F",
    Store: "#8E44AD",
    Dining: "#27AE60",
    Study: "#2ECC71",
  };
  return colorMap[name] || "#34495E";
}
