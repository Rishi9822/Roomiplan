function generatePolygonLayout(sides, frontIndex, houseType) {
  if (!sides || sides.length < 3) {
    throw new Error("At least 3 sides are required to form a polygon.");
  }

  const rooms = [];

  // Settings
  const startX = 50;
  const startY = 50;
  let currentAngle = 0; // Start facing right
  let x = startX;
  let y = startY;

  // Helper to convert degrees to radians
  const degToRad = (deg) => (deg * Math.PI) / 180;

  // Approximate internal angle for a regular polygon
  const n = sides.length;
  const internalAngle = ((n - 2) * 180) / n;

  for (let i = 0; i < n; i++) {
    const sideIndex = (frontIndex + i) % n;
    const sideLength = sides[sideIndex].length;

    // Save room position
    rooms.push({
      name: `Room ${i + 1}`,
      x: parseFloat(x.toFixed(2)),
      y: parseFloat(y.toFixed(2)),
      width: 8 + (sideLength / 2), // make size reflect length
      height: 8 + (sideLength / 2),
    });

    // Calculate next point using direction vector
    const angleRad = degToRad(currentAngle);
    x += sideLength * Math.cos(angleRad);
    y += sideLength * Math.sin(angleRad);

    // Turn left by the internal angle to form polygon
    currentAngle -= 180 - internalAngle;
  }

  return rooms;
}

module.exports = generatePolygonLayout;
