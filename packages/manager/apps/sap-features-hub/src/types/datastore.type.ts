export type Datastore = {
  datastoreId: string;
  name: string;
};

export type VsanDatastore = {
  clusterId: number;
  connectionState: 'offline' | 'online';
  datacenterId: number;
  datastoreId: number;
  datastoreName: string;
  spaceFree: number;
  spaceProvisioned: number;
  spaceUsed: number;
  vmTotal: number;
};

export type FormattedDatastore = (Datastore | VsanDatastore) & {
  isVsan: boolean;
  datastoreName: string;
};
