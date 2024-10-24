/** AI Solutions Volume Object */
export interface VolumeStatus {
  /** Volume Id */
  id?: string;
  /** Path where the data is mounted inside the container */
  mountPath?: string;
  /** User volume Id */
  userVolumeId?: string;
}
