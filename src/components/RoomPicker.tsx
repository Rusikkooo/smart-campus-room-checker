import { fmt } from "@/lib/availability";
import type { Room } from "@/lib/availability";

type Props = {
  rooms: Room[];
  selectedId: string;
  onSelect: (id: string) => void;
};

export function RoomPicker({ rooms, selectedId, onSelect }: Props) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-semibold text-slate-700 mb-2">
        Select a room
      </legend>
      <div className="grid gap-2">
        {rooms.map((r) => {
          const active = r.id === selectedId;
          const blocked = r.blocked;
          return (
            <label
              key={r.id}
              className={`flex items-center justify-between rounded-xl border px-4 py-3 cursor-pointer transition-colors ${
                active
                  ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <span className="flex items-center gap-3">
                <input
                  type="radio"
                  name="room"
                  value={r.id}
                  checked={active}
                  onChange={() => onSelect(r.id)}
                  className="accent-blue-600"
                />
                <span className="flex flex-col">
                  <span className="font-medium text-slate-800">{r.name}</span>
                  <span className="text-xs text-slate-500">{r.location}</span>
                </span>
              </span>
              <span className="flex flex-col items-end">
                {blocked ? (
                  <span className="text-xs font-semibold text-red-600">
                    Blocked
                  </span>
                ) : (
                  <span className="text-xs text-slate-500">
                    {r.bookings.length} booking{r.bookings.length === 1 ? "" : "s"}
                  </span>
                )}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

type BookingsProps = { room: Room };

export function ExistingBookings({ room }: BookingsProps) {
  if (room.blocked) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
        This room is blocked and cannot be booked.
      </div>
    );
  }
  if (room.bookings.length === 0) {
    return (
      <div className="rounded-lg bg-slate-50 border border-slate-200 px-4 py-3 text-sm text-slate-500">
        No existing bookings for this room.
      </div>
    );
  }
  return (
    <ul className="space-y-1.5">
      {room.bookings.map((b, i) => (
        <li
          key={i}
          className="flex items-center justify-between rounded-lg bg-slate-50 border border-slate-200 px-4 py-2 text-sm"
        >
          <span className="text-slate-600">Booking {i + 1}</span>
          <span className="font-mono font-medium text-slate-800">
            {fmt(b.start)} – {fmt(b.end)}
          </span>
        </li>
      ))}
    </ul>
  );
}
