"use client";

import { useState, useEffect } from "react";

type PodData = {
  id: string;
  name: string;
  status: string;
  ledLights: string;
  accessCode: string | null;
  ReservationExpiry: string | null;
  SessionEnd: string | null;
  LeavingPodEnd: string | null;
  GracePeriod: string | null;
  minutesRemaining: number;
  blueLedOn: boolean;
  sessionStartedBy: "button" | "presence" | "app" | null;
};

export default function DemoDashboard() {
  const [pod, setPod] = useState<PodData | null>(null);
  const [eventLogs, setEventLogs] = useState<{ time: string; message: string }[]>([]);

  useEffect(() => {
    const fetchPodData = async () => {
      try {
        const res = await fetch("/api/hardware", {
          cache: "no-store",
        });

        if (!res.ok) return;

        const data: PodData = await res.json();

        setPod((prevPod) => {
          // Check of de status is veranderd ten opzichte van de vorige seconde
          if (!prevPod || prevPod.status !== data.status) {
            const timeStr = new Date().toLocaleTimeString();
            const logMessage = `Status gewijzigd naar: ${data.status.toUpperCase()}`;

            // Voeg de nieuwe actie toe aan de bovenkant van het logboek
            setEventLogs((prevLogs) =>
              [{ time: timeStr, message: logMessage }, ...prevLogs].slice(0, 10)
            );
          }

          return data;
        });
      } catch (error) {
        console.error("Fout bij ophalen pod data", error);
      }
    };

    // Haal direct op bij laden...
    fetchPodData();

    // ...en herhaal dit daarna elke 1 seconde!
    const interval = setInterval(fetchPodData, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!pod)
    return (
      <div className="p-10 text-xl font-bold">
        Verbinden met Vercel Server...
      </div>
    );

  // Bepaal de kleur voor het dashboard op basis van de status
  let bgColor = "bg-green-500";
  if (pod.status === "Reserved" || pod.status === "Leaving") bgColor = "bg-yellow-400";
  if (pod.status === "Occupied") bgColor = "bg-red-500";

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <h1 className="text-4xl font-extrabold mb-8 text-gray-800">
        📡 Live Demo Dashboard
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* LINKER PANEEL: Huidige Status */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-500 mb-4">
            Huidige Pod Status
          </h2>

          <div
            className={`${bgColor} text-white text-5xl font-black py-12 px-6 rounded-xl text-center shadow-inner transition-colors duration-500`}
          >
            {pod.status.toUpperCase()}
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 text-lg">
            <div className="bg-gray-100 p-4 rounded-lg">
              <span className="block text-sm text-gray-500">LED Kleur</span>
              <span className="font-bold">{pod.ledLights}</span>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg">
              <span className="block text-sm text-gray-500">Blauwe LED</span>
              <span className="font-bold">
                {pod.blueLedOn ? "🔵 Aan" : "⚪ Uit"}
              </span>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg">
              <span className="block text-sm text-gray-500">Gestart door</span>
              <span className="font-bold">
                {pod.sessionStartedBy ?? "—"}
              </span>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg">
              <span className="block text-sm text-gray-500">Toegangscode</span>
              <span className="font-bold">{pod.accessCode ?? "—"}</span>
            </div>
          </div>
        </div>

        {/* RECHTER PANEEL: Live Event Logboek */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 flex flex-col">
          <h2 className="text-2xl font-bold text-gray-500 mb-4">
            Live Gebeurtenissen (Laatste 10)
          </h2>

          <div className="flex-1 bg-gray-900 rounded-xl p-4 overflow-hidden">
            {eventLogs.length === 0 ? (
              <p className="text-gray-400 italic font-mono">
                Wachten op systeem events...
              </p>
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