function generateRoomLayout(plotLength, plotWidth, rooms) {
  const totalRooms = rooms.length;
  const roomHeight = plotLength / totalRooms;

  const layout = rooms.map((room, index) => {
    return {
      name: room,
      x: 0,
      y: index * roomHeight,
      width: plotWidth,
      height: roomHeight,
    };
  });

  return layout;
}

module.exports = generateRoomLayout;
