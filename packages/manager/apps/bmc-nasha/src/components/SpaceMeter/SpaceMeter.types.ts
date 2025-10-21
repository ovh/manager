export type StorageUsage = {
  size: { value: number; unit: string; name: string };
  used?: { value: number; unit: string; name: string };
  usedbysnapshots?: { value: number; unit: string; name: string };
};

export type SpaceMeterProps = {
  usage: StorageUsage;
  large?: boolean;
  help?: boolean;
  legend?: boolean;
};

export type StorageProgressBarProps = {
  totalSize: number;
  used: number;
  usedBySnapshots: number;
  large?: boolean;
};
