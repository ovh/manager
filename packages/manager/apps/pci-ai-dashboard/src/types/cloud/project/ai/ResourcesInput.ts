/** AI Solutions Resource Object */
export interface ResourcesInput {
  /** Number of vCPU resources requested */
  cpu: number;
  /** The amount of ephemeral storage in bytes */
  ephemeralStorage: number;
  /** Instance flavor */
  flavor: string;
  /** Number of GPU resources requested */
  gpu: number;
  /** The GPU Brand */
  gpuBrand: string;
  /** The GPU Memory in bytes */
  gpuMemory: number;
  /** The GPU Model */
  gpuModel: string;
  /** The amount of memory in bytes */
  memory: number;
  /** The private network bandwidth in bits per seconds */
  privateNetwork: number;
  /** The public network bandwidth in bits per seconds */
  publicNetwork: number;
}
