export const getLifecycleQueryKey = ({
  projectId,
  region,
  name,
}: {
  projectId: string;
  region: string;
  name: string;
}) => [projectId, 'region', region, 'storage', name, 'lifecycle'];
