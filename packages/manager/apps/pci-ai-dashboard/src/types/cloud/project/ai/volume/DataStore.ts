/** AI Solutions data store container Volume Object */
export interface DataStore {
  /** Data store alias */
  alias: string;
  /** Name of the tar archive that needs to be saved */
  archive: string;
  /** Data store container to attach */
  container: string;
  /** True if data is stored on OVHcloud AI's internal storage */
  internal: boolean;
  /** Prefix to fetch only part of the volume */
  prefix: string;
}
