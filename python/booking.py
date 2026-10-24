"""Smart Campus Room Availability Checker - booking rule (final version).

All times are integer minutes after midnight (0..1440).
The function only CHECKS availability; it never creates or changes bookings.
"""

DAY_START = 0          # 00:00
DAY_END = 1440         # 24:00
MAX_DURATION = 120     # AC2: exactly 120 minutes is allowed


def _is_minute(value):
    # CHANGED (fix F1): bool is a subclass of int in Python, so exclude it explicitly
    return isinstance(value, int) and not isinstance(value, bool)


def can_book(start, end, now, blocked, existing):
    """Return True only if [start, end) can be booked, otherwise False.

    start, end -- candidate interval in integer minutes after midnight
    now        -- current time in minutes (assumed valid, 0..1439)
    blocked    -- True if the selected room is blocked
    existing   -- iterable of (s, e) bookings; it is only read, never modified
    """
    # AC3: a blocked room rejects every request
    if blocked:
        return False

    # AC1: integer minutes only  # NEW (fix F1)
    if not (_is_minute(start) and _is_minute(end)):
        return False

    # AC1: inside the day and start strictly before end
    if not (DAY_START <= start < end <= DAY_END):
        return False

    # AC1: start must be strictly after now (starting exactly now is rejected)
    if start <= now:
        return False

    # AC2: duration may not exceed 120 minutes
    if end - start > MAX_DURATION:
        return False

    # AC4: half-open intervals; touching endpoints do NOT overlap
    for booked_start, booked_end in existing:
        if start < booked_end and booked_start < end:
            return False

    # AC5: plain bool, inputs untouched
    return True
