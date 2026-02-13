export type LifecycleStorageParams = {
  projectId: string;
  region: string;
  name: string;
};

export const getLifecycleQueryKey = ({
  projectId,
  region,
  name,
}: LifecycleStorageParams) => [
  projectId,
  'region',
  region,
  'storage',
  name,
  'lifecycle',
];
