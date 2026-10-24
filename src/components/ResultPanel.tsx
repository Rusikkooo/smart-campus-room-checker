import { fmt } from "@/lib/availability";
import type { AvailabilityResult } from "@/lib/availability";
import { CheckCircle2, XCircle, Clock, CalendarX } from "lucide-react";

type Props = {
  result: AvailabilityResult | null;
  range: { start: number; end: number } | null;
};

export function ResultPanel({ result, range }: Props) {
  if (!result || !range) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
        <Clock className="h-8 w-8 text-slate-300 mb-2" />
        <p className="text-sm text-slate-400">
          Pick a room, set the time, and press Check to see availability.
        </p>
      </div>
    );
  }

  const timeLabel = `${fmt(range.start)} – ${fmt(range.end)}`;

  if (result.available) {
    return (
      <div
        role="status"
        className="flex flex-col gap-3 rounded-xl border border-emerald-300 bg-emerald-50 px-5 py-5"
      >
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-6 w-6 text-emerald-600" />
          <span className="text-lg font-bold text-emerald-800">Available</span>
        </div>
        <p className="text-sm text-emerald-700">
          The room is free for <span className="font-semibold">{timeLabel}</span> ({range.end - range.start} min).
        </p>
      </div>
    );
  }

  const icon = result.code === "room_blocked" ? CalendarX : XCircle;
  const Icon = icon;

  return (
    <div
      role="alert"
      className="flex flex-col gap-3 rounded-xl border border-red-300 bg-red-50 px-5 py-5"
    >
      <div className="flex items-center gap-2">
        <Icon className="h-6 w-6 text-red-600" />
        <span className="text-lg font-bold text-red-800">Unavailable</span>
      </div>
      <p className="text-sm text-red-700">{result.reason}</p>
    </div>
  );
}
