import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Address4 } from 'ip-address';

import { aclsQueryKey } from '@/adapters/acl/queryKeys';
import { mapAclToCreateToDto } from '@/adapters/acl/right/mapper';
import { createAcl } from '@/data/api/acl.api';
import { TAclToCreate } from '@/domain/entities/acl.entity';
import { isAclToCreateValid } from '@/domain/services/acl.service';
import {
  TPermissionOption,
  mapPermissionOptionToPermissions,
} from '@/pages/dashboard/Acl/acl.view-model';

export type TUseAddAclOptions = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

export type CreateAclCommand = {
  sourceIpOrCidr: string;
  accessPermission: TPermissionOption;
};

const mapCommandToEntity = (command: CreateAclCommand): TAclToCreate => ({
  source: { id: command.sourceIpOrCidr },
  permissions: mapPermissionOptionToPermissions(command.accessPermission),
});

export const useCreateAcl = (
  projectId: string,
  region: string,
  shareId: string,
  options?: TUseAddAclOptions,
) => {
  const queryClient = useQueryClient();
  const { onSuccess: onSuccessOption, onError } = options ?? {};

  return useMutation<void, Error, CreateAclCommand>({
    mutationFn: async (command: CreateAclCommand): Promise<void> => {
      const aclToCreate = mapCommandToEntity(command);

      if (!isAclToCreateValid(aclToCreate)) {
        throw new Error('Invalid ACL configuration');
      }

      const aclSourceAddress = new Address4(aclToCreate.source.id);

      if (!aclSourceAddress.isCorrect()) {
        throw new Error('Invalid source IP address');
      }

      const aclToCreateDto = mapAclToCreateToDto(aclToCreate);
      await createAcl({ projectId, region, shareId, aclToCreateDto });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: aclsQueryKey(projectId, region, shareId),
      });
      onSuccessOption?.();
    },
    onError,
  });
};
