import { TBackupDTO } from '@/adapters/tanstack/backups/right/dto.type';
import { mapBackupDtoToBackupEntity } from '@/adapters/tanstack/backups/right/mapper';
import { TBackup } from '@/domain/entities/backup';
import { v6 } from '@ovh-ux/manager-core-api';

export type TGetBackupsQueryParams = {
  limit?: number;
};

export const getBackups = ({
  projectId,
  region,
  params,
}: {
  projectId: string;
  region: string;
  params: TGetBackupsQueryParams;
}): Promise<TBackup[]> =>
  v6
    .get<TBackupDTO[]>(
      `/cloud/project/${projectId}/aggregated/instanceBackup`,
      {
        params: {
          limit: params.limit ?? 100,
          region,
        },
      },
    )
    .then((response) => mapBackupDtoToBackupEntity(response.data));
