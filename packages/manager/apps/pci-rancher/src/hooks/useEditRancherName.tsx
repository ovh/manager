import { useMutation } from '@tanstack/react-query';
import {
  editRancherService,
  patchRancherServiceQueryKey,
} from '../api/apiv2/services';
import { RancherService } from '../api/api.type';

const useEditRancherName = ({
  rancherId,
  projectId,
  onSuccess,
  onError,
}: {
  rancherId: string;
  projectId: string;
  onSuccess: () => void;
  onError: () => void;
}) => {
  return useMutation({
    mutationFn: (rancherUpdated: RancherService) =>
      editRancherService({
        rancherId,
        projectId,
        rancher: rancherUpdated,
      }),
    onSuccess,
    onError,
    mutationKey: patchRancherServiceQueryKey(rancherId),
  });
};

export default useEditRancherName;
