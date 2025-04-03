type Datacenter =
  | "bhs1" | "bhs2" | "bhs3" | "bhs4" | "bhs5" | "bhs6" | "bhs7" | "bhs8"
  | "cch01" | "crx1" | "crx2" | "dc1" | "eri1" | "eri2" | "gra04" | "gra1"
  | "gra2" | "gra3" | "gsw" | "hdf01" | "hil1" | "ieb01" | "lil1-int1"
  | "lim1" | "lim2" | "lim3" | "mr901" | "p19" | "rbx" | "rbx-hz" | "rbx1"
  | "rbx10" | "rbx2" | "rbx3" | "rbx4" | "rbx5" | "rbx6" | "rbx7" | "rbx8"
  | "rbx9" | "sbg1" | "sbg2" | "sbg3" | "sbg4" | "sbg5" | "sgp02" | "sgp1"
  | "syd03" | "syd1" | "syd2" | "vin1" | "waw1" | "ynm1" | "yyz01";

type PowerState = "poweroff" | "poweron";

type ServerState = "error" | "hacked" | "hackedBlocked" | "ok";

type SupportLevel = "critical" | "fastpath" | "gs" | "pro";

interface Iam {
  displayName?: string | null;
  id: string; // UUID
}

interface Tags {
  [key: string]: string;
}

export interface DedicatedServerWithIAM {
  availabilityZone: string;
  bootId?: number | null;
  bootScript?: string | null;
  commercialRange: string;
  datacenter: Datacenter;
  efiBootloaderPath?: string | null;
  iam?: Iam | null;
  tags?: Tags | null;
  urn: string;
  ip: string; // IPv4
  linkSpeed?: number | null;
  monitoring: boolean;
  name: string;
  newUpgradeSystem: boolean;
  noIntervention?: boolean;
  os: string;
  powerState: PowerState;
  professionalUse: boolean;
  rack: string;
  region: string;
  rescueMail?: string | null;
  rescueSshKey?: string | null;
  reverse: string;
  rootDevice?: string | null;
  serverId: number;
  state?: ServerState;
  supportLevel: SupportLevel;
}
