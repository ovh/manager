/** Archive a ColdArchiveContainer */
export interface ArchiveColdArchiveContainer {
  /** Archive is locked (cannot be deleted) for the given number of days */
  lockedUntilDays: number;
}
