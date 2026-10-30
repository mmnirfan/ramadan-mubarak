/**
 * Ramadan 2027 Sehri / Iftar timetable for Hoskote and Bengaluru (IST).
 *
 * Calculated from the sun's position and calibrated against the local 2026
 * Bangalore Rural District masjid timetable (the district Hoskote is in):
 * - Fajr azan: sun 18.1° below the horizon + 1 min (matches 2026 chart, mean error 0.5 min)
 * - Sehri ends 5 minutes before the Fajr azan (same as the chart)
 * - Iftar: sunset with the sun 1.01° below the horizon (mean error 0.1 min)
 *
 * Times are keyed by date, so they stay correct even if Ramadan starts a day later.
 * Each time is [hours, minutes] in 24h IST.
 */
export interface TimetableDay {
  date: string // yyyy-MM-dd
  sehri: readonly [number, number]
  azan: readonly [number, number]
  iftar: readonly [number, number]
}

export const RAMADAN_TIMETABLE: readonly TimetableDay[] = [
  { date: '2027-02-09', sehri: [5, 27], azan: [5, 32], iftar: [18, 24] },
  { date: '2027-02-10', sehri: [5, 27], azan: [5, 32], iftar: [18, 25] },
  { date: '2027-02-11', sehri: [5, 27], azan: [5, 32], iftar: [18, 25] },
  { date: '2027-02-12', sehri: [5, 27], azan: [5, 32], iftar: [18, 25] },
  { date: '2027-02-13', sehri: [5, 27], azan: [5, 32], iftar: [18, 26] },
  { date: '2027-02-14', sehri: [5, 26], azan: [5, 31], iftar: [18, 26] },
  { date: '2027-02-15', sehri: [5, 26], azan: [5, 31], iftar: [18, 26] },
  { date: '2027-02-16', sehri: [5, 26], azan: [5, 31], iftar: [18, 26] },
  { date: '2027-02-17', sehri: [5, 25], azan: [5, 30], iftar: [18, 27] },
  { date: '2027-02-18', sehri: [5, 25], azan: [5, 30], iftar: [18, 27] },
  { date: '2027-02-19', sehri: [5, 25], azan: [5, 30], iftar: [18, 27] },
  { date: '2027-02-20', sehri: [5, 24], azan: [5, 29], iftar: [18, 27] },
  { date: '2027-02-21', sehri: [5, 24], azan: [5, 29], iftar: [18, 28] },
  { date: '2027-02-22', sehri: [5, 24], azan: [5, 29], iftar: [18, 28] },
  { date: '2027-02-23', sehri: [5, 23], azan: [5, 28], iftar: [18, 28] },
  { date: '2027-02-24', sehri: [5, 23], azan: [5, 28], iftar: [18, 28] },
  { date: '2027-02-25', sehri: [5, 22], azan: [5, 27], iftar: [18, 28] },
  { date: '2027-02-26', sehri: [5, 22], azan: [5, 27], iftar: [18, 29] },
  { date: '2027-02-27', sehri: [5, 22], azan: [5, 27], iftar: [18, 29] },
  { date: '2027-02-28', sehri: [5, 21], azan: [5, 26], iftar: [18, 29] },
  { date: '2027-03-01', sehri: [5, 21], azan: [5, 26], iftar: [18, 29] },
  { date: '2027-03-02', sehri: [5, 20], azan: [5, 25], iftar: [18, 29] },
  { date: '2027-03-03', sehri: [5, 20], azan: [5, 25], iftar: [18, 29] },
  { date: '2027-03-04', sehri: [5, 19], azan: [5, 24], iftar: [18, 30] },
  { date: '2027-03-05', sehri: [5, 18], azan: [5, 23], iftar: [18, 30] },
  { date: '2027-03-06', sehri: [5, 18], azan: [5, 23], iftar: [18, 30] },
  { date: '2027-03-07', sehri: [5, 17], azan: [5, 22], iftar: [18, 30] },
  { date: '2027-03-08', sehri: [5, 17], azan: [5, 22], iftar: [18, 30] },
  { date: '2027-03-09', sehri: [5, 16], azan: [5, 21], iftar: [18, 30] },
  { date: '2027-03-10', sehri: [5, 16], azan: [5, 21], iftar: [18, 30] },
]
