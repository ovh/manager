import { TGetBackupsQueryParams } from '@/data/api/backups';

export const backupsQueryKey = (
  projectId: string,
  region: string,
  params: TGetBackupsQueryParams,
) =>
  [
    'project',
    projectId,
    'region',
    region,
    'backups',
    { limit: params.limit },
  ] as const;
