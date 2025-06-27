// src/components/RoomToolbox.jsx
import React from "react";
import { useDrag } from "react-dnd";

const roomTypes = [
  "Hall",
  "Bedroom",
  "Kitchen",
  "Bathroom",
  "Parking",
  "Dining",
  "Store",
  "Study",
];

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

const RoomItem = ({ type }) => {
  const [, dragRef] = useDrag({
    type: "roomType",
    item: { roomType: type },
  });

  return (
    <div
      ref={dragRef}
      className="cursor-move rounded-lg px-3 py-1 text-sm font-medium text-center shadow hover:scale-105 transition duration-200"
      style={{ backgroundColor: roomColors[type.toLowerCase()] || "#eee" }}
    >
      {type}
    </div>
  );
};

export default function RoomToolbox() {
  return (
    <div className="bg-white/90 backdrop-blur-md shadow-xl p-4 rounded-xl w-40">
      <h3 className="text-center text-lg font-semibold mb-3 text-gray-800">
        Add Room
      </h3>
      <div className="flex flex-col gap-2">
        {roomTypes.map((type) => (
          <RoomItem key={type} type={type} />
        ))}
      </div>
    </div>
  );
}
