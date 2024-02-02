export interface Engine {
  versions: Version[];
  name: string;
}

export interface Version {
  plans: Plan[];
  name: string;
  startDate: Date;
  endOfLife?: Date;
  endOfSale?: Date;
  tags: ('NEW' | 'SOON_EOL' | 'SOON_EOS')[];
}

export interface Plan {
  regions: Region[];
  name: string;
  storage?: {
    minimum: { unit: string; value: number };
    maximum: { unit: string; value: number };
  };
  ram?: {
    minimum: { unit: string; value: number };
    maximum: { unit: string; value: number };
  };
  cpu?: {
    minimum: number;
    maximum: number;
  };
  nodes: {
    minimum: number;
    maximum: number;
  };
  networks: ('private' | 'public')[];
}

export interface Region {
  flavors: Flavor[];
  name: string;
}

export interface Flavor {
  name: string;
  vcores?: number;
  ram?: { unit: string; value: number };
  storage?: {
    minimum: { unit: string; value: number };
    maximum: { unit: string; value: number };
    step?: { unit: string; value: number };
  };
}
