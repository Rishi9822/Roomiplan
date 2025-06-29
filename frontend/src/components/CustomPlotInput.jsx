import React from "react";

export default function CustomPlotInput({ points, setPoints }) {
  const handleClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100; // percent-based
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPoints([...points, { x, y }]);
  };

  const handleReset = () => {
    setPoints([]);
  };

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-2">Define Irregular Plot</h2>
      <div className="relative border border-dashed border-gray-400 rounded-lg overflow-hidden bg-white shadow-md">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          onClick={handleClick}
          className="w-full h-64 cursor-crosshair"
        >
          {/* Polygon Preview */}
          {points.length > 2 && (
            <polygon
              points={points.map((p) => `${p.x},${p.y}`).join(" ")}
              fill="#dbeafe"
              stroke="#2563eb"
              strokeWidth="0.5"
            />
          )}

          {/* Dots */}
          {points.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="1.2" fill="#1d4ed8" />
          ))}
        </svg>
        <div className="p-2 flex justify-between items-center bg-white">
          <span className="text-sm text-gray-600">
            {points.length === 0
              ? "Click to add plot corners."
              : `${points.length} point${points.length > 1 ? "s" : ""} added.`}
          </span>
          <button
            onClick={handleReset}
            className="text-sm px-3 py-1 rounded bg-red-100 text-red-600 hover:bg-red-200"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
