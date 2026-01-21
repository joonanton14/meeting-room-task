export function overlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date): boolean {
  // [start, end) – end==other.start ei ole päällekkäinen
  return aStart < bEnd && bStart < aEnd;
}