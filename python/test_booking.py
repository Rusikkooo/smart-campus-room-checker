"""Acceptance tests for can_book (AC1-AC5).

Run against the final version:   python3 -m unittest -v test_booking
Run against the saved AI v1:     BOOKING_IMPL=v1 python3 -m unittest -v test_booking
"""
import copy
import importlib.util
import os
import unittest

_HERE = os.path.dirname(os.path.abspath(__file__))
_IMPL = os.environ.get("BOOKING_IMPL", "final")
_PATH = os.path.join(_HERE, "v1", "booking.py") if _IMPL == "v1" else os.path.join(_HERE, "booking.py")
_spec = importlib.util.spec_from_file_location("booking", _PATH)
booking = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(booking)
can_book = booking.can_book

# Base data from the assignment (Task 4)
NOW = 540
EXISTING = [(600, 660)]


class RequiredCases(unittest.TestCase):
    """T01-T06: the six cases given in Task 4."""

    def test_T01_touching_end_is_available(self):          # AC4
        self.assertTrue(can_book(660, 720, NOW, False, EXISTING))

    def test_T02_overlap_is_unavailable(self):             # AC4
        self.assertFalse(can_book(630, 690, NOW, False, EXISTING))

    def test_T03_blocked_room_is_unavailable(self):        # AC3
        self.assertFalse(can_book(660, 720, NOW, True, EXISTING))

    def test_T04_exactly_120_is_available(self):           # AC2
        self.assertTrue(can_book(720, 840, NOW, False, EXISTING))

    def test_T05_121_minutes_is_unavailable(self):         # AC2
        self.assertFalse(can_book(720, 841, NOW, False, EXISTING))

    def test_T06_starts_now_is_unavailable(self):          # AC1
        self.assertFalse(can_book(540, 570, NOW, False, EXISTING))


class ExtraCases(unittest.TestCase):
    """T07-T20: reversed times, day bounds, multiple bookings, unchanged inputs, types."""

    def test_T07_reversed_times(self):                     # AC1
        self.assertFalse(can_book(720, 660, NOW, False, EXISTING))

    def test_T08_zero_length(self):                        # AC1 start < end
        self.assertFalse(can_book(700, 700, NOW, False, EXISTING))

    def test_T09_end_exactly_1440_is_available(self):      # AC1 upper bound inclusive
        self.assertTrue(can_book(1380, 1440, NOW, False, EXISTING))

    def test_T10_end_after_1440(self):                     # AC1
        self.assertFalse(can_book(1400, 1441, NOW, False, EXISTING))

    def test_T11_negative_start(self):                     # AC1
        self.assertFalse(can_book(-10, 30, 0, False, []))

    def test_T12_start_in_past(self):                      # AC1
        self.assertFalse(can_book(500, 560, NOW, False, []))

    def test_T13_one_minute_after_now(self):               # AC1 strictly after
        self.assertTrue(can_book(541, 571, NOW, False, EXISTING))

    def test_T14_touching_start_of_booking(self):          # AC4
        self.assertTrue(can_book(560, 600, NOW, False, EXISTING))

    def test_T15_inside_existing(self):                    # AC4
        self.assertFalse(can_book(610, 650, NOW, False, EXISTING))

    def test_T16_covers_existing(self):                    # AC4
        self.assertFalse(can_book(590, 670, NOW, False, EXISTING))

    def test_T17_multiple_bookings_gap_fits(self):         # AC4
        existing = [(600, 660), (720, 780), (900, 960)]
        self.assertTrue(can_book(660, 720, NOW, False, existing))

    def test_T18_multiple_bookings_hits_later_one(self):   # AC4
        existing = [(600, 660), (720, 780), (900, 960)]
        self.assertFalse(can_book(850, 910, NOW, False, existing))

    def test_T19_inputs_unchanged(self):                   # AC5
        existing = [(900, 960), (600, 660)]
        snapshot = copy.deepcopy(existing)
        can_book(660, 720, NOW, False, existing)
        can_book(630, 690, NOW, False, existing)
        self.assertEqual(existing, snapshot)

    def test_T20_non_integer_minutes_rejected(self):       # AC1 "integer minutes"
        self.assertFalse(can_book(660.5, 720, NOW, False, EXISTING))
        self.assertFalse(can_book(660, 720.0, NOW, False, EXISTING))
        self.assertFalse(can_book(True, 60, 0, False, []))   # bool is not a minute value

    def test_T21_returns_real_bool(self):                  # AC5 unambiguous result
        self.assertIs(can_book(660, 720, NOW, False, EXISTING), True)
        self.assertIs(can_book(630, 690, NOW, False, EXISTING), False)


if __name__ == "__main__":
    unittest.main(verbosity=2)
