'use client';

import { useState, useEffect } from 'react';

export default function DemoDashboard() {
  const [pod, setPod] = useState<any>(null);
  const [eventLogs, setEventLogs] = useState<{time: string, message: string}[]>([]);

  useEffect(() => {
    const fetchPodData = async () => {
      try {
        const res = await fetch('/api/hardware');
        if (!res.ok) return;
        const data = await res.json();

        setPod((prevPod: any) => {
          // If this is the initial load, just set the data without logging
          if (!prevPod) return data;

          let newLogs: {time: string, message: string}[] = [];
          const timeStr = new Date().toLocaleTimeString();

          // 1. Check if the main Pod status changed
          if (prevPod.status !== data.status) {
            newLogs.push({ time: timeStr, message: `Status gewijzigd naar: ${data.status.toUpperCase()}` });
          }

          // 2. Check if the Radar (Presence) state changed
          if (prevPod.PresenceDetected !== data.PresenceDetected) {
            if (data.PresenceDetected) {
              newLogs.push({ time: timeStr, message: `Radar: Persoon gedetecteerd! 🟢` });
            } else {
              newLogs.push({ time: timeStr, message: `Radar: Niemand meer in beeld ⚪` });
            }
          }

          // 3. Check if the physical button was pressed
          if (prevPod.ButtonPressed !== data.ButtonPressed && data.ButtonPressed) {
            newLogs.push({ time: timeStr, message: `Knop: Fysieke knop ingedrukt! 🔘` });
          }

          // If any changes occurred, append them to the top of our log list
          if (newLogs.length > 0) {
            // Add new logs to the top, and keep the latest 15 entries
            setEventLogs((prevLogs: any) => [...newLogs, ...prevLogs].slice(0, 15));
          }

          return data;
        });
      } catch (error) {
        console.error("Fout bij ophalen pod data", error);
      }
    };

    fetchPodData();
    const interval = setInterval(fetchPodData, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!pod) return <div className="p-10 text-xl font-bold">Verbinden met Server...</div>;

  // Determine dashboard background color based on status
  let bgColor = "bg-green-500";
  if (pod.status === "Reserved" || pod.status === "Leaving") bgColor = "bg-yellow-400";
  if (pod.status === "Occupied") bgColor = "bg-red-500";

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <h1 className="text-4xl font-extrabold mb-8 text-gray-800">📡 Live Demo Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* LEFT PANEL: Current Status */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-500 mb-4">Huidige Pod Status</h2>
          <div className={`${bgColor} text-white text-5xl font-black py-12 px-6 rounded-xl text-center shadow-inner transition-colors duration-500`}>
            {pod.status.toUpperCase()}
          </div>
          
          <div className="mt-8 grid grid-cols-2 gap-4 text-lg">
            <div className="bg-gray-100 p-4 rounded-lg">
              <span className="block text-sm text-gray-500">Radar Detectie</span>
              <span className="font-bold">{pod.PresenceDetected ? "🟢 Actief" : "⚪ Niemand gezien"}</span>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <span className="block text-sm text-gray-500">Fysieke Knop</span>
              <span className="font-bold">{pod.ButtonPressed ? "🔘 Ingedrukt!" : "⚪ Wachten..."}</span>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Live Event Log */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 flex flex-col">
          <h2 className="text-2xl font-bold text-gray-500 mb-4">Live Gebeurtenissen (Laatste 15)</h2>
          <div className="flex-1 bg-gray-900 rounded-xl p-4 overflow-hidden min-h-[300px]">
            {eventLogs.length === 0 ? (
              <p className="text-gray-400 italic font-mono">Wachten op systeem events...</p>
            ) : (
              <ul className="space-y-3 font-mono text-sm">
                {eventLogs.map((log, index) => (
                  <li key={index} className="border-b border-gray-700 pb-2">
                    <span className="text-blue-400 mr-3">[{log.time}]</span>
                    <span className="text-green-400">{log.message}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
