/** AI Solutions private Swift container Volume Object. Deprecated: Use DataStore instead */
export interface PrivateSwift {
  /** Name of the tar archive that needs to be saved */
  archive: string;
  /** Public Cloud Storage container to attach */
  container: string;
  /** True if data is stored on OVHcloud AI's internal storage */
  internal?: boolean;
  /** Prefix to fetch only part of the volume */
  prefix: string;
  /** Public Cloud Storage Region */
  region: string;
}
