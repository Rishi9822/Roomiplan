import React, { useEffect, useRef } from "react";

export default function PolygonPlotMap({ sides = [], frontIndex = 0 }) {
  const canvasRef = useRef();

  // Function to compute polygon points from side lengths
  const calculatePolygonPoints = (sides) => {
    const angle = (2 * Math.PI) / sides.length;
    const centerX = 250;
    const centerY = 250;
    const scale = 10;

    let points = [];
    for (let i = 0; i < sides.length; i++) {
      const x = centerX + Math.cos(i * angle) * sides[i].length * scale;
      const y = centerY + Math.sin(i * angle) * sides[i].length * scale;
      points.push({ x, y });
    }

    return points;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!sides.length || sides.length < 3) return;

    const points = calculatePolygonPoints(sides);

    // Draw polygon
    ctx.beginPath();
    ctx.strokeStyle = "#4F46E5";
    ctx.lineWidth = 3;
    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }

    ctx.closePath();
    ctx.stroke();

    // Draw vertices and front label
    points.forEach((pt, i) => {
      ctx.beginPath();
      ctx.fillStyle = i === frontIndex ? "#F59E0B" : "#6366F1";
      ctx.arc(pt.x, pt.y, 6, 0, 2 * Math.PI);
      ctx.fill();

      ctx.fillStyle = "#000";
      ctx.font = "14px Arial";
      ctx.fillText(`S${i + 1}`, pt.x + 8, pt.y - 8);
    });

    // Label "Front"
    const front = points[frontIndex];
    const next = points[(frontIndex + 1) % points.length];
    const midX = (front.x + next.x) / 2;
    const midY = (front.y + next.y) / 2;

    ctx.fillStyle = "#EF4444";
    ctx.font = "bold 16px Arial";
    ctx.fillText("Front", midX, midY);
  }, [sides, frontIndex]);

  return (
    <div className="border rounded-xl bg-white shadow overflow-hidden">
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        className="w-full h-auto bg-gray-50"
      />
    </div>
  );
}
