import { useEffect, useMemo, useState } from "react";
import { SAMPLE_ROOMS } from "@/data/rooms";
import { checkAvailability, fmt } from "@/lib/availability";
import type { AvailabilityResult, Room } from "@/lib/availability";
import { RoomPicker, ExistingBookings } from "@/components/RoomPicker";
import { TimeSelect } from "@/components/TimeSelect";
import { ResultPanel } from "@/components/ResultPanel";
import { Clock, Search, Building2 } from "lucide-react";

const DEFAULT_NOW = 570; // 09:30
const DEFAULT_START = 585; // 09:45
const DEFAULT_END = 645; // 10:45

export default function App() {
  const [roomId, setRoomId] = useState<string>(SAMPLE_ROOMS[0].id);
  const [now, setNow] = useState<number>(DEFAULT_NOW);
  const [start, setStart] = useState<number>(DEFAULT_START);
  const [end, setEnd] = useState<number>(DEFAULT_END);
  const [result, setResult] = useState<AvailabilityResult | null>(null);

  const room: Room = useMemo(
    () => SAMPLE_ROOMS.find((r) => r.id === roomId) ?? SAMPLE_ROOMS[0],
    [roomId]
  );

  // Clear any previous result whenever any input changes, so the displayed
  // result always belongs to the current inputs (not a stale green panel).
  useEffect(() => {
    setResult(null);
  }, [roomId, now, start, end]);

  const validationErrors: string[] = [];
  if (start >= end) validationErrors.push("Start must be earlier than end.");
  if (start <= now)
    validationErrors.push("Start must be strictly after the current time.");
  if (end - start > 120)
    validationErrors.push("Duration must not exceed 120 minutes.");

  function handleCheck(e: React.FormEvent) {
    e.preventDefault();
    const res = checkAvailability({ now, start, end, room });
    setResult(res);
  }

  function resetDemo() {
    setRoomId(SAMPLE_ROOMS[0].id);
    setNow(DEFAULT_NOW);
    setStart(DEFAULT_START);
    setEnd(DEFAULT_END);
    setResult(null);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto max-w-3xl px-4 py-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800 leading-tight">
              Smart Campus Room Availability Checker
            </h1>
            <p className="text-xs text-slate-500">
              Check whether a room is free — no booking is created.
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6 space-y-6">
        {/* Room selection */}
        <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
          <RoomPicker rooms={SAMPLE_ROOMS} selectedId={roomId} onSelect={setRoomId} />
        </section>

        {/* Existing bookings for the selected room */}
        <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5 space-y-3">
          <h2 className="text-sm font-semibold text-slate-700">
            Existing bookings
          </h2>
          <ExistingBookings room={room} />
        </section>

        {/* Time + check form */}
        <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-2 text-slate-700">
            <Clock className="h-4 w-4" />
            <h2 className="text-sm font-semibold">Set times</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <TimeSelect
              label="Simulated now"
              value={now}
              onChange={setNow}
              help="Pretend this is the current time."
            />
            <TimeSelect
              label="Start"
              value={start}
              onChange={setStart}
            />
            <TimeSelect
              label="End"
              value={end}
              onChange={setEnd}
            />
          </div>

          {/* Live preview + validation */}
          <div className="rounded-lg bg-slate-50 border border-slate-200 px-4 py-3 space-y-1 text-sm">
            <p className="text-slate-600">
              Checking: <span className="font-medium text-slate-800">{room.name}</span>
            </p>
            <p className="text-slate-600">
              Requested slot:{" "}
              <span className="font-mono font-medium text-slate-800">
                {fmt(start)} – {fmt(end)}
              </span>{" "}
              <span className="text-slate-400">({end - start} min)</span>
            </p>
            {validationErrors.length > 0 && (
              <ul className="mt-1 list-disc pl-5 text-red-600 text-xs space-y-0.5">
                {validationErrors.map((msg, i) => (
                  <li key={i}>{msg}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleCheck}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-white font-semibold transition-colors hover:bg-blue-700"
            >
              <Search className="h-4 w-4" />
              Check availability
            </button>
            <button
              type="button"
              onClick={resetDemo}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-slate-700 font-medium hover:bg-slate-50"
            >
              Reset
            </button>
          </div>
        </section>

        {/* Result */}
        <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
          <ResultPanel
            result={result}
            range={result ? { start, end } : null}
          />
        </section>

        <footer className="text-center text-xs text-slate-400 pb-6">
          Prototype · Fictional sample data · Availability check only — no bookings are created or changed.
        </footer>
      </main>
    </div>
  );
}
