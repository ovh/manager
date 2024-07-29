/** AI Solutions Global Resource per flavor unit */
export interface ResourcesPerUnit {
  /** The amount of cpu for one unit of the flavor */
  cpu?: number;
  /** The amount of ephemeral storage in bytes */
  ephemeralStorage?: number;
  /** The amount of memory in bytes */
  memory?: number;
  /** The guarantee private bandwidth in bytes per seconds */
  privateNetwork?: number;
  /** The guarantee public bandwidth in bytes per seconds */
  publicNetwork?: number;
}
