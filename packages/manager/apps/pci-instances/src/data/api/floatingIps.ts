import { TFloatingIpDTO } from '@/adapters/tanstack/configuration/right/dto.type';
import { mapFloatingIpDtoToEntity } from '@/adapters/tanstack/configuration/right/mapper';
import { TFloatingIp } from '@/domain/entities/configuration';
import { v6 } from '@ovh-ux/manager-core-api';

export const getFloatingIps = ({
  projectId,
  regionName,
}: {
  projectId: string;
  regionName: string;
}): Promise<TFloatingIp[]> =>
  v6
    .get<TFloatingIpDTO[]>(
      `/cloud/project/${projectId}/region/${regionName}/floatingip`,
    )
    .then((response) => mapFloatingIpDtoToEntity(response.data));
