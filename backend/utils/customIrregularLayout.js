// // utils/customIrregularLayout.js
// function generateSmartLayoutInPolygon(sides, frontIndex, houseType) {
//   if (!Array.isArray(sides) || sides.length < 3) {
//     throw new Error("At least 3 sides required to form a polygon");
//   }
// console.log("🧠 Generating layout with:", { sides, frontIndex, houseType });
//   // --- Constants ---
//   const centerX = 400;
//   const centerY = 250;
//   const radius = 200;
//   const totalSides = sides.length;
//   const angleStep = (2 * Math.PI) / totalSides;

//   // --- 1. Generate polygon points in clockwise order ---
//   const polygonPoints = sides.map((side, i) => {
//     const angle = (i - frontIndex) * angleStep - Math.PI / 2; // rotate front to top
//     return {
//       x: centerX + radius * Math.cos(angle),
//       y: centerY + radius * Math.sin(angle),
//     };
//   });

//   // --- 2. Get bounding box of the polygon ---
//   const minX = Math.min(...polygonPoints.map(p => p.x));
//   const maxX = Math.max(...polygonPoints.map(p => p.x));
//   const minY = Math.min(...polygonPoints.map(p => p.y));
//   const maxY = Math.max(...polygonPoints.map(p => p.y));

//   const boundingWidth = maxX - minX;
//   const boundingHeight = maxY - minY;

//   const padding = 20;
//   const usableWidth = boundingWidth - 2 * padding;
//   const usableHeight = boundingHeight - 2 * padding;

//   // --- 3. Define room stack by house type ---
//   let roomList = [];
//   if (houseType === "1BHK") {
//     roomList = ["Hall", "Bedroom", "Kitchen", "Bathroom"];
//   } else if (houseType === "2BHK") {
//     roomList = [
//       "Parking",
//       "Hall",
//       "Bedroom 1",
//       "Bedroom 2",
//       "Bathroom (Attached)",
//       "Kitchen",
//       "Bathroom (Common)",
//     ];
//   } else if (houseType === "3BHK") {
//     roomList = [
//       "Parking",
//       "Hall",
//       "Bedroom 1",
//       "Bedroom 2",
//       "Bedroom 3",
//       "Kitchen",
//       "Bathroom (Attached)",
//       "Bathroom (Common)",
//     ];
//   } else {
//     roomList = ["Hall", "Bedroom", "Kitchen"];
//   }

//   // --- 4. Stack rooms vertically inside bounding box ---
//   const roomHeight = usableHeight / roomList.length;

//   const layout = roomList.map((name, index) => ({
//     name,
//     x: minX + padding,
//     y: minY + padding + index * roomHeight,
//     width: usableWidth,
//     height: roomHeight - 4,
//   }));

//   return {
//     layout: Array.isArray(layout) ? [...layout] : [],
//     polygonPoints: Array.isArray(polygonPoints) ? [...polygonPoints] : [],
//   };
// }

// module.exports = { generateSmartLayoutInPolygon };


function generateSmartLayoutInPolygon(sides, frontIndex, houseType) {
  if (!Array.isArray(sides) || sides.length < 3) {
    throw new Error("At least 3 sides are required to form a polygon");
  }

  console.log("🧠 Generating layout with:", { sides, frontIndex, houseType });

  // 1. Constants
  const centerX = 400;
  const centerY = 250;
  const totalSides = sides.length;
  const averageLength = sides.reduce((a, b) => a + b, 0) / totalSides;
  const scaleFactor = 2;
  const angleStep = (2 * Math.PI) / totalSides;

  // 2. Generate approximate polygon points in clockwise direction
  const polygonPoints = [];
  for (let i = 0; i < sides.length; i++) {
    const angle = ((i - frontIndex) * angleStep) - Math.PI / 2;
    const length = sides[i] * scaleFactor;
    const x = centerX + length * Math.cos(angle);
    const y = centerY + length * Math.sin(angle);
    polygonPoints.push({ x, y });
  }

  // 3. Close the polygon by connecting last point to the first
  polygonPoints.push({ ...polygonPoints[0] });

  // 4. Bounding box for inner layout
  const minX = Math.min(...polygonPoints.map(p => p.x));
  const maxX = Math.max(...polygonPoints.map(p => p.x));
  const minY = Math.min(...polygonPoints.map(p => p.y));
  const maxY = Math.max(...polygonPoints.map(p => p.y));

  const padding = 20;
  const usableX = minX + padding;
  const usableY = minY + padding;
  const usableWidth = (maxX - minX) - 2 * padding;
  const usableHeight = (maxY - minY) - 2 * padding;

  // 5. House type room list
  let roomList = [];
  if (houseType === "1BHK") {
    roomList = ["Hall", "Bedroom", "Kitchen", "Bathroom"];
  } else if (houseType === "2BHK") {
    roomList = [
      "Parking", "Hall", "Bedroom 1", "Bedroom 2",
      "Bathroom (Attached)", "Kitchen", "Bathroom (Common)"
    ];
  } else if (houseType === "3BHK") {
    roomList = [
      "Parking", "Hall", "Bedroom 1", "Bedroom 2", "Bedroom 3",
      "Kitchen", "Bathroom (Attached)", "Bathroom (Common)"
    ];
  } else {
    roomList = ["Hall", "Bedroom", "Kitchen"];
  }

  const roomHeight = usableHeight / roomList.length;

  // 6. Create layout inside bounding box
  const layout = roomList.map((name, index) => ({
    name,
    x: usableX,
    y: usableY + index * roomHeight,
    width: usableWidth,
    height: roomHeight - 4,
  }));

  return {
    layout,
    polygonPoints: polygonPoints.slice(0, -1), // return closed polygon without repeating start
  };
}

module.exports = { generateSmartLayoutInPolygon };
