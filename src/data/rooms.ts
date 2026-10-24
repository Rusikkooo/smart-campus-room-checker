import type { Room } from "@/lib/availability";

// Fictional in-memory sample data only. No database, no server, no APIs.
export const SAMPLE_ROOMS: Room[] = [
  {
    id: "r-lib-201",
    name: "Athena Library Room 201",
    location: "Central Library · 2nd floor",
    blocked: false,
    bookings: [{ roomId: "r-lib-201", start: 600, end: 660 }], // 10:00–11:00
  },
  {
    id: "r-eng-104",
    name: "Tesla Engineering Lab 104",
    location: "Engineering Block · 1st floor",
    blocked: false,
    bookings: [
      { roomId: "r-eng-104", start: 540, end: 600 }, // 09:00–10:00
      { roomId: "r-eng-104", start: 780, end: 840 }, // 13:00–14:00
    ],
  },
  {
    id: "r-art-007",
    name: "Curie Studio 007",
    location: "Arts Pavilion · ground floor",
    blocked: false,
    bookings: [],
  },
  {
    id: "r-maint",
    name: "Newton Lecture Hall A",
    location: "Science Quad · main hall",
    blocked: true, // AC3: one blocked room
    bookings: [],
  },
];
