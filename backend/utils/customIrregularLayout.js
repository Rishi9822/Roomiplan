// function generateSmartLayoutInPolygon(sides, frontIndex, houseType) {
//   if (!Array.isArray(sides) || sides.length < 3) {
//     throw new Error("At least 3 sides are required to form a polygon");
//   }

//   console.log("🧠 Generating layout with:", { sides, frontIndex, houseType });

//   // 1. Constants
//   const centerX = 400;
//   const centerY = 250;
//   const totalSides = sides.length;
//   const averageLength = sides.reduce((a, b) => a + b, 0) / totalSides;
//   const scaleFactor = 2;
//   const angleStep = (2 * Math.PI) / totalSides;

//   // 2. Generate approximate polygon points in clockwise direction
//   const polygonPoints = [];
//   for (let i = 0; i < sides.length; i++) {
//     const angle = ((i - frontIndex) * angleStep) - Math.PI / 2;
//     const length = sides[i] * scaleFactor;
//     const x = centerX + length * Math.cos(angle);
//     const y = centerY + length * Math.sin(angle);
//     polygonPoints.push({ x, y });
//   }

//   // 3. Close the polygon by connecting last point to the first
//   polygonPoints.push({ ...polygonPoints[0] });

//   // 4. Bounding box for inner layout
//   const minX = Math.min(...polygonPoints.map(p => p.x));
//   const maxX = Math.max(...polygonPoints.map(p => p.x));
//   const minY = Math.min(...polygonPoints.map(p => p.y));
//   const maxY = Math.max(...polygonPoints.map(p => p.y));

//   const padding = 20;
//   const usableX = minX + padding;
//   const usableY = minY + padding;
//   const usableWidth = (maxX - minX) - 2 * padding;
//   const usableHeight = (maxY - minY) - 2 * padding;

//   // 5. House type room list
//   let roomList = [];
//   if (houseType === "1BHK") {
//     roomList = ["Hall", "Bedroom", "Kitchen", "Bathroom"];
//   } else if (houseType === "2BHK") {
//     roomList = [
//       "Parking", "Hall", "Bedroom 1", "Bedroom 2",
//       "Bathroom (Attached)", "Kitchen", "Bathroom (Common)"
//     ];
//   } else if (houseType === "3BHK") {
//     roomList = [
//       "Parking", "Hall", "Bedroom 1", "Bedroom 2", "Bedroom 3",
//       "Kitchen", "Bathroom (Attached)", "Bathroom (Common)"
//     ];
//   } else {
//     roomList = ["Hall", "Bedroom", "Kitchen"];
//   }

//   const roomHeight = usableHeight / roomList.length;

//   // 6. Create layout inside bounding box
//   const layout = roomList.map((name, index) => ({
//     name,
//     x: usableX,
//     y: usableY + index * roomHeight,
//     width: usableWidth,
//     height: roomHeight - 4,
//   }));

//   return {
//     layout,
//     polygonPoints: polygonPoints.slice(0, -1), // return closed polygon without repeating start
//   };
// }

// module.exports = { generateSmartLayoutInPolygon };


// utils/customIrregularLayout.js
function generateSmartLayoutInPolygon(sides, frontIndex, houseType) {
  if (!Array.isArray(sides) || sides.length < 3) {
    throw new Error("At least 3 sides are required to form a polygon");
  }

  console.log("🧠 Generating layout with:", { sides, frontIndex, houseType });

  const centerX = 400;
  const centerY = 250;
  const scale = 15;
  const totalSides = sides.length;
  const angleStep = (2 * Math.PI) / totalSides;

  // 1. Generate rotated polygon points from side lengths
  const polygonPoints = [];
  for (let i = 0; i < totalSides; i++) {
    const angle = ((i - frontIndex) * angleStep) - Math.PI / 2;
    const radius = sides[i] * scale;
    polygonPoints.push({
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    });
  }

  // 2. Bounding box of polygon
  const minX = Math.min(...polygonPoints.map(p => p.x));
  const maxX = Math.max(...polygonPoints.map(p => p.x));
  const minY = Math.min(...polygonPoints.map(p => p.y));
  const maxY = Math.max(...polygonPoints.map(p => p.y));

  const padding = 20;
  const usableWidth = (maxX - minX) - 2 * padding;
  const usableHeight = (maxY - minY) - 2 * padding;
  const startX = minX + padding;
  const startY = minY + padding;

  // 3. Define rooms
  let roomList = [];
  if (houseType === "1BHK") {
    roomList = ["Hall", "Bedroom", "Kitchen", "Bathroom"];
  } else if (houseType === "2BHK") {
    roomList = ["Parking", "Hall", "Bedroom 1", "Bedroom 2", "Kitchen", "Bathroom (Common)", "Bathroom (Attached)"];
  } else if (houseType === "3BHK") {
    roomList = ["Parking", "Hall", "Bedroom 1", "Bedroom 2", "Bedroom 3", "Kitchen", "Bathroom (Common)", "Bathroom (Attached)"];
  } else {
    roomList = ["Hall", "Bedroom", "Kitchen"];
  }

  const roomHeight = usableHeight / roomList.length;

  // 4. Stack rooms inside the bounding box
  const layout = roomList.map((name, index) => ({
    name,
    x: startX,
    y: startY + index * roomHeight,
    width: usableWidth,
    height: roomHeight - 5,
  }));

  return {
    layout,
    polygonPoints
  };
}

module.exports = { generateSmartLayoutInPolygon };
