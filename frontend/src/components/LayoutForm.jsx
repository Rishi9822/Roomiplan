import { useState } from 'react';
import LayoutMap from './LayoutMap';

const LayoutForm = () => {
  const [plotLength, setPlotLength] = useState('');
  const [plotWidth, setPlotWidth] = useState('');
  const [rooms, setRooms] = useState('');
  const [layoutData, setLayoutData] = useState(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const roomArray = rooms.split(',').map((room) => room.trim());

    const response = await fetch('http://localhost:5000/api/layout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plotLength, plotWidth, rooms: roomArray }),
    });

    const data = await response.json();
    console.log("Received layout:", data.layout);

    setLayoutData(data.layout);
    setMessage(data.message || data.error);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-6">
      <div className="bg-white shadow-2xl rounded-lg p-8 w-full max-w-xl transition-transform transform hover:scale-[1.01]">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
          🏗️ Create Room Layout
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="number"
            placeholder="Plot Length"
            value={plotLength}
            onChange={(e) => setPlotLength(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="number"
            placeholder="Plot Width"
            value={plotWidth}
            onChange={(e) => setPlotWidth(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="text"
            placeholder="Rooms (comma-separated)"
            value={rooms}
            onChange={(e) => setRooms(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg text-lg font-bold shadow-md hover:shadow-xl transition duration-300"
          >
            🚀 Submit
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
        )}
      </div>

      {layoutData && (
        <div className="mt-8 w-full max-w-4xl">
          <LayoutMap
            layout={layoutData}
            plotWidth={Number(plotWidth)}
            plotLength={Number(plotLength)}
          />
        </div>
      )}
    </div>
  );
};

export default LayoutForm;
