/** AI Solutions Resource Object */
export interface Resources {
  /** Number of vCPU resources requested */
  cpu?: number;
  /** The amount of ephemeral storage in bytes */
  ephemeralStorage?: number;
  /** Current instance flavor */
  flavor?: string;
  /** Number of GPU resources requested */
  gpu?: number;
  /** The GPU Brand */
  gpuBrand?: string;
  /** The GPU Memory in bits */
  gpuMemory?: number;
  /** The GPU Model */
  gpuModel?: string;
  /** The amount of memory in bytes */
  memory?: number;
  /** The guarantee private bandwidth in bytes per seconds */
  privateNetwork?: number;
  /** The guarantee public bandwidth in bytes per seconds */
  publicNetwork?: number;
}
