/** AI Solutions Project Quotas */
export interface ProjectQuotas {
  /** Project's quotas per compute-type resource (e.g CPU/GPU) */
  resources?: { [key: string]: number };
  /** Storage quota (in bits) that is allocated to the project */
  storage?: number;
}
