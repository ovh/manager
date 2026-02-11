export type TCreateSharePayload = {
  type: string;
  description?: string | null;
  name?: string | null;
  networkId?: string | undefined;
  size?: number | undefined;
  snapshotId?: string | null;
  subnetId?: string | undefined;
};
