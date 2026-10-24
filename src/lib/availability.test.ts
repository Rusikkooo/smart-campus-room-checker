import { describe, it, expect } from "vitest";
import { checkAvailability, type Room } from "./availability";

const NOW = 540;
const mk = (o: Partial<Room> = {}): Room => ({ id: "r1", name: "Test Room", location: "B", blocked: false, bookings: [{ roomId: "r1", start: 600, end: 660 }], ...o });
const run = (start: number, end: number, room: Room = mk(), now = NOW) => {
  const before = JSON.stringify(room);
  const res = checkAvailability({ now, start, end, room });
  expect(JSON.stringify(room)).toBe(before);
  return res;
};

describe("A3 acceptance set (AC1-AC5)", () => {
  it("A01 touching 660-720 -> Available (AC4)", () => { expect(run(660, 720).available).toBe(true); });
  it("A02 overlap 630-690 -> Unavailable (AC4)", () => { expect(run(630, 690).available).toBe(false); });
  it("A03 blocked 660-720 -> Unavailable (AC3)", () => { expect(run(660, 720, mk({ blocked: true })).available).toBe(false); });
  it("A04 exactly 120 720-840 -> Available (AC2)", () => { expect(run(720, 840).available).toBe(true); });
  it("A05 121 min 720-841 -> Unavailable (AC2)", () => { expect(run(720, 841).available).toBe(false); });
  it("A06 starts now 540-570 -> Unavailable (AC1)", () => { expect(run(540, 570).available).toBe(false); });
  it("A07 reversed 720-660 -> Unavailable (AC1)", () => { expect(run(720, 660).available).toBe(false); });
  it("A08 zero length 700-700 -> Unavailable (AC1)", () => { expect(run(700, 700).available).toBe(false); });
  it("A09 day end 1380-1440 -> Available (AC1)", () => { expect(run(1380, 1440).available).toBe(true); });
  it("A10 past day end 1400-1441 -> Unavailable (AC1)", () => { expect(run(1400, 1441).available).toBe(false); });
  it("A11 negative start -10..30 -> Unavailable (AC1)", () => { expect(run(-10, 30, mk({ bookings: [] }), 0).available).toBe(false); });
  it("A12 non-integer 660.5-720 -> Unavailable (AC1)", () => { expect(run(660.5, 720).available).toBe(false); });
  it("A13 multiple bookings, gap fits 660-720 -> Available (AC4)", () => { expect(run(660, 720, mk({ bookings: [{ roomId: "r1", start: 600, end: 660 }, { roomId: "r1", start: 720, end: 780 }, { roomId: "r1", start: 900, end: 960 }] })).available).toBe(true); });
  it("A14 multiple bookings, hits 3rd 850-910 -> Unavailable (AC4)", () => { expect(run(850, 910, mk({ bookings: [{ roomId: "r1", start: 600, end: 660 }, { roomId: "r1", start: 720, end: 780 }, { roomId: "r1", start: 900, end: 960 }] })).available).toBe(false); });
  it("A15 blocked + starts now -> reason says blocked (AC3, V1-03)", () => { const r = run(540, 570, mk({ blocked: true })); expect(r.available).toBe(false); expect(JSON.stringify(r)).toMatch(/blocked/i); });
});
