import { v6 } from '@ovh-ux/manager-core-api';
import { TBackupConfiguration } from '@/domain/entities/configuration';
import { TBackupConfigurationDTO } from '../../adapters/tanstack/configuration/right/dto.type';
import { mapBackupConfigurationDtoToEntity } from '@/adapters/tanstack/configuration/right/mapper';

type TGetBackupConfigurationArgs = {
  projectId: string;
};

export const getBackupConfiguration = async ({
  projectId,
}: TGetBackupConfigurationArgs): Promise<TBackupConfiguration[]> =>
  v6
    .get<TBackupConfigurationDTO>(
      `/cloud/project/${projectId}/catalog/instanceBackup`,
    )
    .then((response) => mapBackupConfigurationDtoToEntity(response.data));
