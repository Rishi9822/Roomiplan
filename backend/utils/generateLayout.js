// Updated generateRoomLayout.js with strategy support
function generateRoomLayout(plotLength, plotWidth, rooms, layoutType = 'default') {
  const ROOM_WEIGHTS = {
    hall: 3,
    bedroom: 2,
    kitchen: 1.5,
    bathroom: 0.5,
    dining: 1.5,
    store: 0.5,
    study: 1,
  };

  const totalPlotArea = plotLength * plotWidth;

  const nestBathroom = rooms.includes("bedroom") && rooms.includes("bathroom");
  const hallIndex = rooms.findIndex(r => r.toLowerCase() === 'hall');
  const bathroomIndex = rooms.findIndex(r => r.toLowerCase() === 'bathroom');

  const filteredRooms = rooms.filter((r, i) => {
    if (i === hallIndex) return false;
    if (i === bathroomIndex && nestBathroom) return false;
    return true;
  });

  const totalWeight = rooms.reduce((sum, room, i) => {
    if (i === bathroomIndex && nestBathroom) return sum;
    return sum + (ROOM_WEIGHTS[room.toLowerCase()] || 1);
  }, 0);

  const roomAreas = filteredRooms.map(r => {
    const w = ROOM_WEIGHTS[r.toLowerCase()] || 1;
    return (w / totalWeight) * totalPlotArea;
  });

  if (layoutType === "vertical") {
    return generateVerticalLayout(plotLength, plotWidth, filteredRooms, roomAreas, nestBathroom, hallIndex !== -1);
  } else if (layoutType === "split") {
    return generateSplitLayout(plotLength, plotWidth, filteredRooms, roomAreas, nestBathroom, hallIndex !== -1);
  } else {
    return generateDefaultLayout(plotLength, plotWidth, filteredRooms, roomAreas, nestBathroom, hallIndex !== -1);
  }
}

function generateDefaultLayout(plotLength, plotWidth, filteredRooms, roomAreas, nestBathroom, hasHall) {
  const layout = [];

  const frontRowHeight = plotLength * 0.2;
  const hallArea = hasHall ? (3 / (3 + filteredRooms.length)) * (plotLength * plotWidth) : 0;
  let hallWidth = hallArea / frontRowHeight;

  const maxHallWidth = plotWidth * 0.7;
  hallWidth = Math.min(hallWidth, maxHallWidth);

  let parkingWidth = plotWidth - hallWidth;
  if (parkingWidth < 3) {
    parkingWidth = 3;
    hallWidth = plotWidth - parkingWidth;
  }

  if (hasHall) {
    layout.push({ name: 'Parking', x: 0, y: 0, width: parkingWidth, height: frontRowHeight });
    layout.push({ name: 'Hall', x: parkingWidth, y: 0, width: hallWidth, height: frontRowHeight });
  }

  let x = 0, y = frontRowHeight, maxRowHeight = 0;

  for (let i = 0; i < filteredRooms.length; i++) {
    const area = roomAreas[i];
    const name = filteredRooms[i];
    const aspectRatio = 1.2;

    let width = Math.sqrt(area * aspectRatio);
    let height = area / width;

    if (x + width > plotWidth) {
      x = 0;
      y += maxRowHeight;
      maxRowHeight = 0;
    }

    const room = { name, x, y, width, height };
    layout.push(room);

    if (nestBathroom && name.toLowerCase() === 'bedroom') {
      const bathroomArea = (0.5 / (3 + filteredRooms.length)) * (plotLength * plotWidth);
      const nestedWidth = room.width * 0.35;
      const nestedHeight = bathroomArea / nestedWidth;

      layout.push({
        name: 'Bathroom',
        x: room.x + room.width - nestedWidth - 0.3,
        y: room.y + 0.3,
        width: nestedWidth,
        height: nestedHeight,
      });
    }

    x += width;
    maxRowHeight = Math.max(maxRowHeight, height);
  }

  return layout;
}

function generateVerticalLayout(plotLength, plotWidth, filteredRooms, roomAreas, nestBathroom, hasHall) {
  const layout = [];
  let y = 0;
  const heightUnit = plotLength / (filteredRooms.length + (hasHall ? 1 : 0));

  if (hasHall) {
    layout.push({ name: "Hall", x: 0, y, width: plotWidth, height: heightUnit });
    y += heightUnit;
  }

  for (let i = 0; i < filteredRooms.length; i++) {
    const name = filteredRooms[i];
    const height = heightUnit;
    const width = plotWidth;

    layout.push({ name, x: 0, y, width, height });

    if (nestBathroom && name.toLowerCase() === "bedroom") {
      layout.push({
        name: "Bathroom",
        x: width * 0.6,
        y: y + 0.2,
        width: width * 0.35,
        height: height * 0.4,
      });
    }

    y += height;
  }
  return layout;
}

function generateSplitLayout(plotLength, plotWidth, filteredRooms, roomAreas, nestBathroom, hasHall) {
  const layout = [];
  const half = Math.ceil(filteredRooms.length / 2);
  const colWidth = plotWidth / 2;
  let y1 = hasHall ? plotLength * 0.2 : 0;
  let y2 = y1;

  if (hasHall) {
    layout.push({ name: "Hall", x: 0, y: 0, width: plotWidth, height: plotLength * 0.2 });
  }

  for (let i = 0; i < filteredRooms.length; i++) {
    const name = filteredRooms[i];
    const height = plotLength * 0.2;

    const room = {
      name,
      x: i < half ? 0 : colWidth,
      y: i < half ? y1 : y2,
      width: colWidth,
      height,
    };
    layout.push(room);

    if (nestBathroom && name.toLowerCase() === "bedroom") {
      layout.push({
        name: "Bathroom",
        x: room.x + room.width - room.width * 0.4,
        y: room.y + 0.3,
        width: room.width * 0.35,
        height: height * 0.4,
      });
    }

    if (i < half) y1 += height;
    else y2 += height;
  }

  return layout;
}

module.exports = generateRoomLayout;
