// utils/customIrregularLayout.js
function generateSmartLayoutInPolygon(sides, frontIndex, houseType) {
  if (!Array.isArray(sides) || sides.length < 3) {
    throw new Error("At least 3 sides required to form a polygon");
  }

  // --- Constants ---
  const centerX = 400;
  const centerY = 250;
  const radius = 200;
  const totalSides = sides.length;
  const angleStep = (2 * Math.PI) / totalSides;

  // --- 1. Generate polygon points in clockwise order ---
  const polygonPoints = sides.map((side, i) => {
    const angle = (i - frontIndex) * angleStep - Math.PI / 2; // rotate front to top
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  });

  // --- 2. Get bounding box of the polygon ---
  const minX = Math.min(...polygonPoints.map(p => p.x));
  const maxX = Math.max(...polygonPoints.map(p => p.x));
  const minY = Math.min(...polygonPoints.map(p => p.y));
  const maxY = Math.max(...polygonPoints.map(p => p.y));

  const boundingWidth = maxX - minX;
  const boundingHeight = maxY - minY;

  const padding = 20;
  const usableWidth = boundingWidth - 2 * padding;
  const usableHeight = boundingHeight - 2 * padding;

  // --- 3. Define room stack by house type ---
  let roomList = [];
  if (houseType === "1BHK") {
    roomList = ["Hall", "Bedroom", "Kitchen", "Bathroom"];
  } else if (houseType === "2BHK") {
    roomList = [
      "Parking",
      "Hall",
      "Bedroom 1",
      "Bedroom 2",
      "Bathroom (Attached)",
      "Kitchen",
      "Bathroom (Common)",
    ];
  } else if (houseType === "3BHK") {
    roomList = [
      "Parking",
      "Hall",
      "Bedroom 1",
      "Bedroom 2",
      "Bedroom 3",
      "Kitchen",
      "Bathroom (Attached)",
      "Bathroom (Common)",
    ];
  } else {
    roomList = ["Hall", "Bedroom", "Kitchen"];
  }

  // --- 4. Stack rooms vertically inside bounding box ---
  const roomHeight = usableHeight / roomList.length;

  const layout = roomList.map((name, index) => ({
    name,
    x: minX + padding,
    y: minY + padding + index * roomHeight,
    width: usableWidth,
    height: roomHeight - 4,
  }));

  return {
    layout,
    polygonPoints,
  };
}

module.exports = { generateSmartLayoutInPolygon };
