// // utils/customIrregularLayout.js
// function generateSmartLayoutInPolygon(sides, frontIndex, houseType) {
//   if (!Array.isArray(sides) || sides.length < 3) {
//     throw new Error("At least 3 sides are required to form a polygon");
//   }

//   console.log("🧠 Generating layout with:", { sides, frontIndex, houseType });

//   const centerX = 400;
//   const centerY = 250;
//   const scale = 15;
//   const totalSides = sides.length;
//   const angleStep = (2 * Math.PI) / totalSides;

//   const polygonPoints = [];
// const radius = 150; // Fixed radius
// for (let i = 0; i < totalSides; i++) {
//   const angle = ((i - frontIndex) * angleStep) - Math.PI / 2;
//   polygonPoints.push({
//     x: centerX + radius * Math.cos(angle),
//     y: centerY + radius * Math.sin(angle),
//   });
// }


//   // 2. Bounding box of polygon
//   const minX = Math.min(...polygonPoints.map(p => p.x));
//   const maxX = Math.max(...polygonPoints.map(p => p.x));
//   const minY = Math.min(...polygonPoints.map(p => p.y));
//   const maxY = Math.max(...polygonPoints.map(p => p.y));

//   const padding = 20;
//   const usableWidth = (maxX - minX) - 2 * padding;
//   const usableHeight = (maxY - minY) - 2 * padding;
//   const startX = minX + padding;
//   const startY = minY + padding;

//   // 3. Define rooms
//   let roomList = [];
//   if (houseType === "1BHK") {
//     roomList = ["Hall", "Bedroom", "Kitchen", "Bathroom"];
//   } else if (houseType === "2BHK") {
//     roomList = ["Parking", "Hall", "Bedroom 1", "Bedroom 2", "Kitchen", "Bathroom (Common)", "Bathroom (Attached)"];
//   } else if (houseType === "3BHK") {
//     roomList = ["Parking", "Hall", "Bedroom 1", "Bedroom 2", "Bedroom 3", "Kitchen", "Bathroom (Common)", "Bathroom (Attached)"];
//   } else {
//     roomList = ["Hall", "Bedroom", "Kitchen"];
//   }

//   const roomHeight = usableHeight / roomList.length;

//   // 4. Stack rooms inside the bounding box
//   const layout = roomList.map((name, index) => ({
//     name,
//     x: startX,
//     y: startY + index * roomHeight,
//     width: usableWidth,
//     height: roomHeight - 5,
//   }));

//   return {
//     layout,
//     polygonPoints
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
  const radius = 150; // Fixed radius to keep polygon regular
  const totalSides = sides.length;
  const angleStep = (2 * Math.PI) / totalSides;

  // 1. Generate polygon points (using regular polygon shape)
  const polygonPoints = [];
  for (let i = 0; i < totalSides; i++) {
    const angle = ((i - frontIndex) * angleStep) - Math.PI / 2;
    polygonPoints.push({
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    });
  }

  // 2. Bounding box
  const minX = Math.min(...polygonPoints.map(p => p.x));
  const maxX = Math.max(...polygonPoints.map(p => p.x));
  const minY = Math.min(...polygonPoints.map(p => p.y));
  const maxY = Math.max(...polygonPoints.map(p => p.y));

  const padding = 30;
  const safeMarginX = 30;
  const safeMarginY = 30;

  const usableWidth = (maxX - minX) - padding - safeMarginX;
  const usableHeight = (maxY - minY) - padding - safeMarginY;

  const startX = minX + padding / 2 + safeMarginX / 2;
  const startY = minY + padding / 2 + safeMarginY / 2;

  // 3. Define room list
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

  // 4. Stack rooms inside usable space
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
