import { v6 } from '@ovh-ux/manager-core-api';

import { TAclDto, TAclToCreateDto } from '@/adapters/acl/right/dto.type';
import { mapAclDtoToAcl } from '@/adapters/acl/right/mapper';
import { TAcl } from '@/domain/entities/acl.entity';

export const getAcls = async (
  projectId: string,
  region: string,
  shareId: string,
): Promise<TAcl[]> => {
  return v6
    .get<TAclDto[]>(`/cloud/project/${projectId}/region/${region}/share/${shareId}/acl`)
    .then((response) => response.data.map(mapAclDtoToAcl));
};

export const createAcl = async ({
  projectId,
  region,
  shareId,
  aclToCreateDto,
}: {
  projectId: string;
  region: string;
  shareId: string;
  aclToCreateDto: TAclToCreateDto;
}): Promise<void> => {
  await v6.post<unknown>(
    `/cloud/project/${projectId}/region/${region}/share/${shareId}/acl`,
    aclToCreateDto,
  );
};

export const deleteAcl = async (
  projectId: string,
  region: string,
  shareId: string,
  aclId: string,
): Promise<void> =>
  v6.delete(`/cloud/project/${projectId}/region/${region}/share/${shareId}/acl/${aclId}`);
