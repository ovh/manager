import { v6 } from '@ovh-ux/manager-core-api';

import { TAclToCreateDto } from '@/adapters/acl/right/dto.type';

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
