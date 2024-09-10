import { useMutation } from '@tanstack/react-query';
import {
  editRancherService,
  patchRancherServiceQueryKey,
} from '../../api/services';
import { RancherService } from '@/types/api.type';

export enum EditAction {
  EditName = 'EditName',
  UpdateSoftware = 'UpdateSoftware',
  UpdateOffer = 'UpdateOffer',
}

export type EditMutationVariables = {
  rancher: Partial<RancherService>;
  editAction: EditAction;
};

const useEditRancher = ({
  rancherId,
  projectId,
  onSuccess,
  onError,
}: {
  rancherId: string;
  projectId: string;
  onSuccess?: () => void;
  onError?: () => void;
}) => {
  return useMutation({
    mutationFn: ({ rancher }: EditMutationVariables) =>
      editRancherService({
        rancherId,
        projectId,
        rancher,
      }),
    onSuccess,
    onError,
    mutationKey: patchRancherServiceQueryKey(rancherId),
  });
};

export default useEditRancher;
