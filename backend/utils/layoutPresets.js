function generate1BHKLayout(plotLength, plotWidth) {
  const layout = [];

  const frontHeight = plotLength * 0.25;
  const midHeight = plotLength * 0.4;
  const backHeight = plotLength - frontHeight - midHeight;

  const parkingWidth = plotWidth * 0.4;
  const hallWidth = plotWidth - parkingWidth;

  layout.push({ name: "Parking", x: 0, y: 0, width: parkingWidth, height: frontHeight });
  layout.push({ name: "Hall", x: parkingWidth, y: 0, width: hallWidth, height: frontHeight });
  layout.push({ name: "Bedroom", x: 0, y: frontHeight, width: plotWidth, height: midHeight });

  const kitchenWidth = plotWidth * 0.6;
  layout.push({ name: "Kitchen", x: 0, y: frontHeight + midHeight, width: kitchenWidth, height: backHeight });
  layout.push({ name: "Bathroom", x: kitchenWidth, y: frontHeight + midHeight, width: plotWidth - kitchenWidth, height: backHeight });

  return layout;
}

function generate1BHKVertical(length, width) {
  return [
    { name: "Parking", x: 0, y: 0, width, height: length * 0.1 },
    { name: "Hall", x: 0, y: length * 0.1, width, height: length * 0.25 },
    { name: "Bedroom", x: 0, y: length * 0.35, width, height: length * 0.3 },
    { name: "Kitchen", x: 0, y: length * 0.65, width: width * 0.6, height: length * 0.2 },
    { name: "Bathroom", x: width * 0.6, y: length * 0.65, width: width * 0.4, height: length * 0.2 },
  ];
}

function generate1BHKSplit(length, width) {
  const halfWidth = width / 2;
  return [
    { name: "Parking", x: 0, y: 0, width, height: length * 0.1 },
    { name: "Hall", x: 0, y: length * 0.1, width: halfWidth, height: length * 0.25 },
    { name: "Bedroom", x: halfWidth, y: length * 0.1, width: halfWidth, height: length * 0.25 },
    { name: "Kitchen", x: 0, y: length * 0.35, width: halfWidth, height: length * 0.25 },
    { name: "Bathroom", x: halfWidth, y: length * 0.35, width: halfWidth, height: length * 0.25 },
  ];
}

function generate2BHKLayout(plotLength, plotWidth) {
  const layout = [];

  const frontHeight = plotLength * 0.25;
  const midHeight = plotLength * 0.45;
  const backHeight = plotLength - frontHeight - midHeight;

  const parkingWidth = plotWidth * 0.4;
  const hallWidth = plotWidth - parkingWidth;

  layout.push({ name: "Parking", x: 0, y: 0, width: parkingWidth, height: frontHeight });
  layout.push({ name: "Hall", x: parkingWidth, y: 0, width: hallWidth, height: frontHeight });

  const midY = frontHeight;
  const bedWidth = plotWidth / 2;

  layout.push({ name: "Bedroom 1", x: 0, y: midY, width: bedWidth, height: midHeight });
  layout.push({ name: "Bedroom 2", x: bedWidth, y: midY, width: bedWidth, height: midHeight });

  const attachedBathWidth = bedWidth * 0.35;
  const attachedBathHeight = midHeight * 0.35;

  layout.push({ name: "Bathroom (Attached)", x: bedWidth - attachedBathWidth - 0.3, y: midY + midHeight - attachedBathHeight - 0.3, width: attachedBathWidth, height: attachedBathHeight });

  const backY = frontHeight + midHeight;
  const kitchenWidth = plotWidth * 0.6;

  layout.push({ name: "Kitchen", x: 0, y: backY, width: kitchenWidth, height: backHeight });
  layout.push({ name: "Bathroom (Common)", x: kitchenWidth, y: backY, width: plotWidth - kitchenWidth, height: backHeight });

  return layout;
}

function generate2BHKVertical(length, width) {
  return [
    { name: "Parking", x: 0, y: 0, width, height: length * 0.1 },
    { name: "Hall", x: 0, y: length * 0.1, width, height: length * 0.25 },
    { name: "Bedroom 1", x: 0, y: length * 0.35, width, height: length * 0.25 },
    { name: "Bedroom 2", x: 0, y: length * 0.6, width, height: length * 0.25 },
    { name: "Kitchen", x: 0, y: length * 0.85, width: width * 0.6, height: length * 0.15 },
    { name: "Bathroom", x: width * 0.6, y: length * 0.85, width: width * 0.4, height: length * 0.15 },
  ];
}

function generate2BHKSplit(length, width) {
  const halfWidth = width / 2;
  return [
    { name: "Parking", x: 0, y: 0, width, height: length * 0.1 },
    { name: "Hall", x: 0, y: length * 0.1, width: halfWidth, height: length * 0.3 },
    { name: "Bedroom 1", x: halfWidth, y: length * 0.1, width: halfWidth, height: length * 0.3 },
    { name: "Bedroom 2", x: 0, y: length * 0.4, width: halfWidth, height: length * 0.3 },
    { name: "Kitchen", x: halfWidth, y: length * 0.4, width: halfWidth, height: length * 0.2 },
    { name: "Bathroom", x: 0, y: length * 0.7, width, height: length * 0.1 },
  ];
}

function generate3BHKLayout(plotLength, plotWidth) {
  const layout = [];

  const frontHeight = plotLength * 0.25;
  const midHeight = plotLength * 0.45;
  const backHeight = plotLength - frontHeight - midHeight;

  const parkingWidth = plotWidth * 0.35;
  const hallWidth = plotWidth - parkingWidth;

  layout.push({ name: "Parking", x: 0, y: 0, width: parkingWidth, height: frontHeight });
  layout.push({ name: "Hall", x: parkingWidth, y: 0, width: hallWidth, height: frontHeight });

  const bedWidth = plotWidth / 3;
  const midY = frontHeight;

  layout.push({ name: "Bedroom 1", x: 0, y: midY, width: bedWidth, height: midHeight });
  layout.push({ name: "Bedroom 2", x: bedWidth, y: midY, width: bedWidth, height: midHeight });
  layout.push({ name: "Bedroom 3", x: bedWidth * 2, y: midY, width: bedWidth, height: midHeight });

  const attachedBathWidth = bedWidth * 0.4;
  const attachedBathHeight = midHeight * 0.3;

  layout.push({ name: "Bathroom (Attached)", x: bedWidth - attachedBathWidth - 0.3, y: midY + midHeight - attachedBathHeight - 0.3, width: attachedBathWidth, height: attachedBathHeight });

  const backY = frontHeight + midHeight;
  const kitchenWidth = plotWidth * 0.35;
  const diningWidth = plotWidth * 0.35;
  const bathWidth = plotWidth - kitchenWidth - diningWidth;

  layout.push({ name: "Kitchen", x: 0, y: backY, width: kitchenWidth, height: backHeight });
  layout.push({ name: "Dining", x: kitchenWidth, y: backY, width: diningWidth, height: backHeight });
  layout.push({ name: "Bathroom (Common)", x: kitchenWidth + diningWidth, y: backY, width: bathWidth, height: backHeight });

  return layout;
}

function generate3BHKVertical(length, width) {
  const bedWidth = width / 3;
  return [
    { name: "Parking", x: 0, y: 0, width, height: length * 0.1 },
    { name: "Hall", x: 0, y: length * 0.1, width, height: length * 0.25 },
    { name: "Bedroom 1", x: 0, y: length * 0.35, width: bedWidth, height: length * 0.25 },
    { name: "Bedroom 2", x: bedWidth, y: length * 0.35, width: bedWidth, height: length * 0.25 },
    { name: "Bedroom 3", x: bedWidth * 2, y: length * 0.35, width: bedWidth, height: length * 0.25 },
    { name: "Kitchen", x: 0, y: length * 0.6, width: width * 0.4, height: length * 0.15 },
    { name: "Dining", x: width * 0.4, y: length * 0.6, width: width * 0.4, height: length * 0.15 },
    { name: "Bathroom", x: width * 0.8, y: length * 0.6, width: width * 0.2, height: length * 0.15 },
  ];
}

function generate3BHKSplit(length, width) {
  const halfWidth = width / 2;
  return [
    { name: "Parking", x: 0, y: 0, width, height: length * 0.1 },
    { name: "Hall", x: 0, y: length * 0.1, width: halfWidth, height: length * 0.25 },
    { name: "Bedroom 1", x: halfWidth, y: length * 0.1, width: halfWidth, height: length * 0.25 },
    { name: "Bedroom 2", x: 0, y: length * 0.35, width: halfWidth, height: length * 0.25 },
    { name: "Bedroom 3", x: halfWidth, y: length * 0.35, width: halfWidth, height: length * 0.25 },
    { name: "Kitchen", x: 0, y: length * 0.6, width: halfWidth, height: length * 0.2 },
    { name: "Bathroom", x: halfWidth, y: length * 0.6, width: halfWidth, height: length * 0.2 },
  ];
}

module.exports = {
  generate1BHKLayout,
  generate2BHKLayout,
  generate3BHKLayout,
  generate1BHKVertical,
  generate1BHKSplit,
  generate2BHKVertical,
  generate2BHKSplit,
  generate3BHKVertical,
  generate3BHKSplit,
};
