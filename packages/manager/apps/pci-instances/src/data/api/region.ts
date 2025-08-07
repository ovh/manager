import { v6 } from '@ovh-ux/manager-core-api';

export const enableRegion = ({
  projectId,
  region,
}: {
  projectId: string;
  region: string;
}) => v6.post(`/cloud/project/${projectId}/region`, { region });
