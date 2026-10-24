export type Booking = {
  roomId: string;
  start: number; // minutes after midnight (half-open interval)
  end: number; // minutes after midnight
};

export type Room = {
  id: string;
  name: string;
  location: string;
  blocked: boolean;
  bookings: Booking[];
};

export type AvailabilityRequest = {
  now: number; // simulated current time, minutes after midnight
  start: number; // candidate start, minutes after midnight
  end: number; // candidate end, minutes after midnight
  room: Room;
};

export type AvailabilityResult =
  | { available: true }
  | { available: false; reason: string; code: RejectCode };

export type RejectCode =
  | "invalid_time"
  | "start_not_after_now"
  | "duration_exceeded"
  | "room_blocked"
  | "overlap";

/**
 * Pure availability check. Does not mutate any booking or room data.
 *
 * Rules:
 *  AC1: 0 <= start < end <= 1440; start must be strictly after now (start == now rejected).
 *  AC2: duration = end - start must not exceed 120; exactly 120 is allowed.
 *  AC3: reject when the selected room is blocked.
 *  AC4: reject overlap with existing bookings; touching endpoints do NOT overlap (half-open).
 *  AC5: return an unambiguous Available / Unavailable result.
 */
export function checkAvailability(req: AvailabilityRequest): AvailabilityResult {
  const { now, start, end, room } = req;

  // AC3: blocked room always rejected — reported before any other check.
  if (room.blocked) {
    return {
      available: false,
      code: "room_blocked",
      reason: `${room.name} is currently blocked and cannot be booked.`,
    };
  }

  // AC1: integer minutes after midnight bounds, start < end.
  if (
    !Number.isInteger(start) ||
    !Number.isInteger(end) ||
    !Number.isInteger(now) ||
    start < 0 ||
    end > 1440 ||
    start >= end
  ) {
    return {
      available: false,
      code: "invalid_time",
      reason: "Start must be earlier than end, both within 00:00–24:00.",
    };
  }

  // AC1: start must be strictly after now.
  if (start <= now) {
    return {
      available: false,
      code: "start_not_after_now",
      reason: "Start time must be strictly later than the current simulated time.",
    };
  }

  // AC2: duration cap of 120 minutes.
  const duration = end - start;
  if (duration > 120) {
    return {
      available: false,
      code: "duration_exceeded",
      reason: `Booking length is ${duration} min. Maximum allowed is 120 min.`,
    };
  }

  // AC4: overlap with existing bookings (half-open intervals — touching is fine).
  for (const b of room.bookings) {
    if (start < b.end && b.start < end) {
      return {
        available: false,
        code: "overlap",
        reason: `Overlaps an existing booking (${fmt(b.start)}–${fmt(b.end)}).`,
      };
    }
  }

  // AC5: unambiguous available result.
  return { available: true };
}

/** Format integer minutes after midnight as HH:MM. */
export function fmt(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
