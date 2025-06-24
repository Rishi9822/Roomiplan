const LayoutMap = ({ layout, plotWidth, plotLength }) => {
  const scale = 10; // scaling factor to make it visually bigger on screen

  return (
    <svg
      width={plotWidth * scale}
      height={plotLength * scale}
      style={{ border: '2px solid black', margin: '20px 0' }}
    >
      {layout.map((room, i) => (
        <g key={i}>
          <rect
            x={room.x * scale}
            y={room.y * scale}
            width={room.width * scale}
            height={room.height * scale}
            fill="#a5d6a7"
            stroke="#2e7d32"
            strokeWidth={2}
          />
          <text
            x={(room.x + room.width / 2) * scale}
            y={(room.y + room.height / 2) * scale}
            fontSize="12"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {room.name}
          </text>
        </g>
      ))}
    </svg>
  );
};

export default LayoutMap;
