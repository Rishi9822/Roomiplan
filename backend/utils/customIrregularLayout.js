// // utils/customIrregularLayout.js
// function generateSmartLayoutInPolygon(sides, frontIndex, houseType) {
//   if (!Array.isArray(sides) || sides.length < 3) {
//     throw new Error("At least 3 sides are required to form a polygon");
//   }

//   console.log("🧠 Generating layout with:", { sides, frontIndex, houseType });

//   const centerX = 400;
//   const centerY = 250;
//   const radius = 180; // Fixed radius for now
//   const totalSides = sides.length;
//   const angleStep = (2 * Math.PI) / totalSides;

//   // Step 1: Generate polygon points
//   const polygonPoints = [];
//   for (let i = 0; i < totalSides; i++) {
//     const angle = ((i - frontIndex) * angleStep) - Math.PI / 2;
//     polygonPoints.push({
//       x: centerX + radius * Math.cos(angle),
//       y: centerY + radius * Math.sin(angle),
//     });
//   }

//   // Step 2: Compute bounding box
//   const minX = Math.min(...polygonPoints.map(p => p.x));
//   const maxX = Math.max(...polygonPoints.map(p => p.x));
//   const minY = Math.min(...polygonPoints.map(p => p.y));
//   const maxY = Math.max(...polygonPoints.map(p => p.y));
//   const padding = 10;

//   const usableWidth = (maxX - minX) - 2 * padding;
//   const usableHeight = (maxY - minY) - 2 * padding;
//   const startX = minX + padding;
//   const startY = minY + padding;

//   // Step 3: Define rooms by type
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

//   // Step 4: Fit rooms in columns inside bounding box
//   const numCols = Math.ceil(Math.sqrt(roomList.length));
//   const numRows = Math.ceil(roomList.length / numCols);
//   const roomWidth = usableWidth / numCols;
//   const roomHeight = usableHeight / numRows;

//   const layout = [];
//   let index = 0;

//   for (let row = 0; row < numRows; row++) {
//     for (let col = 0; col < numCols; col++) {
//       if (index >= roomList.length) break;

//       const x = startX + col * roomWidth;
//       const y = startY + row * roomHeight;

//       // Check if room's center is inside the polygon
//       const cx = x + roomWidth / 2;
//       const cy = y + roomHeight / 2;

//       if (pointInPolygon({ x: cx, y: cy }, polygonPoints)) {
//         layout.push({
//           name: roomList[index],
//           x,
//           y,
//           width: roomWidth - 5,
//           height: roomHeight - 5,
//         });
//         index++;
//       }
//     }
//   }

//   return {
//     layout,
//     polygonPoints,
//   };
// }

// // Helper: Point-in-Polygon using ray casting
// function pointInPolygon(point, vs) {
//   let inside = false;
//   for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
//     const xi = vs[i].x, yi = vs[i].y;
//     const xj = vs[j].x, yj = vs[j].y;

//     const intersect =
//       yi > point.y !== yj > point.y &&
//       point.x <
//         ((xj - xi) * (point.y - yi)) / (yj - yi + 0.00001) + xi;

//     if (intersect) inside = !inside;
//   }
//   return inside;
// }

// module.exports = { generateSmartLayoutInPolygon };




// utils/customIrregularLayout.js
function generateSmartLayoutInPolygon(sides, frontIndex, houseType) {
   try {
    if (!Array.isArray(sides) || sides.length < 3) {
      throw new Error("At least 3 sides required to form polygon");
    }

    console.log("➡️ Layout requested:", { sides, frontIndex, houseType });

  const centerX = 300;
  const centerY = 250;
  const radius = 180;
  const totalSides = sides.length;
  const angleStep = (2 * Math.PI) / totalSides;

  // 1. Generate polygon points as a regular polygon (scaled later)
  const polygonPoints = [];
  for (let i = 0; i < totalSides; i++) {
    const angle = ((i - frontIndex) * angleStep) - Math.PI / 2;
    polygonPoints.push({
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    });
  }

  // 2. Prepare room list by house type
  let roomList = [];
  if (houseType === "1BHK") {
    roomList = ["Hall", "Bedroom", "Kitchen", "Bathroom"];
  } else if (houseType === "2BHK") {
    roomList = ["Parking", "Hall", "Bedroom 1", "Bedroom 2", "Kitchen", "Bathroom"];
  } else if (houseType === "3BHK") {
    roomList = ["Parking", "Hall", "Bedroom 1", "Bedroom 2", "Bedroom 3", "Kitchen", "Bathroom"];
  } else {
    roomList = ["Hall", "Bedroom", "Kitchen"];
  }

  // 3. Fit rooms within polygon by trial placement and containment
  const layout = [];
  const polygonContains = (pt) => {
    let inside = false;
    for (let i = 0, j = polygonPoints.length - 1; i < polygonPoints.length; j = i++) {
      const xi = polygonPoints[i].x, yi = polygonPoints[i].y;
      const xj = polygonPoints[j].x, yj = polygonPoints[j].y;
      const intersect = ((yi > pt.y) !== (yj > pt.y)) &&
        (pt.x < (xj - xi) * (pt.y - yi) / (yj - yi + 0.00001) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  };

  const isRoomInsidePolygon = (x, y, w, h) => {
    return (
      polygonContains({ x, y }) &&
      polygonContains({ x: x + w, y }) &&
      polygonContains({ x: x, y: y + h }) &&
      polygonContains({ x: x + w, y: y + h })
    );
  };

  const tryPlaceRoom = (name, width, height) => {
    for (let attempt = 0; attempt < 300; attempt++) {
      const x = Math.random() * (500 - width) + 100;
      const y = Math.random() * (400 - height) + 80;
      if (isRoomInsidePolygon(x, y, width, height)) {
        layout.push({ name, x, y, width, height });
        return true;
      }
    }
    return false;
  };

  // 4. Attempt to place all rooms
  for (const roomName of roomList) {
    const isParking = roomName.toLowerCase().includes("parking");
    const isHall = roomName.toLowerCase() === "hall";

    const width = isParking ? 60 : isHall ? 100 : 80;
    const height = isParking ? 40 : isHall ? 80 : 50;

    const placed = tryPlaceRoom(roomName, width, height);
    if (!placed) {
      console.warn(`⚠️ Could not place room: ${roomName}`);
    }
  }

 return { layout, polygonPoints };
  } catch (error) {
    console.error("❌ generateSmartLayoutInPolygon error:", error.message);
    throw error; // So it bubbles to Express
  }
}

module.exports = { generateSmartLayoutInPolygon };
