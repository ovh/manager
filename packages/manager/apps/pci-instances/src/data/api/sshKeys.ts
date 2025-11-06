import { TSshKeyDTO } from '@/adapters/tanstack/configuration/right/dto.type';
import { mapSshKeyDtoToSshKeyEntity } from '@/adapters/tanstack/configuration/right/mapper';
import { TSshKey } from '@/domain/entities/configuration';
import { v6 } from '@ovh-ux/manager-core-api';

export const getSshKeys = ({
  projectId,
  region,
}: {
  projectId: string;
  region: string;
}): Promise<TSshKey[]> =>
  v6
    .get<TSshKeyDTO[]>(`/cloud/project/${projectId}/region/${region}/sshkey`)
    .then((response) => mapSshKeyDtoToSshKeyEntity(response.data));
