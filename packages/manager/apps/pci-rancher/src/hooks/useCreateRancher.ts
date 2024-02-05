import { useMutation } from '@tanstack/react-query';
import { CreateRancherPayload } from '@/api/api.type';
import {
  createRancherService,
  createRancherServiceQueryKey,
} from '../api/apiv2/services';

export type AccessDetail = {
  username: string;
  password: string;
} | null;

const useCreateRancher = ({
  projectId,
  onSuccess,
  onError,
}: {
  projectId: string;
  onSuccess: () => void;
  onError: () => void;
}) => {
  const { mutate: createRancher, reset } = useMutation({
    mutationFn: (data: CreateRancherPayload) =>
      createRancherService({
        projectId,
        data,
      }),
    onSuccess,
    onError,
    mutationKey: createRancherServiceQueryKey(),
  });

  return {
    createRancher,
    reset,
  };
};

export default useCreateRancher;
