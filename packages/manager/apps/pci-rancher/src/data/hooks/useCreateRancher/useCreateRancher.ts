import { useMutation } from '@tanstack/react-query';
import {
  CreateRancherPayload,
  ErrorResponse,
  RancherService,
} from '@/types/api.type';
import {
  createRancherService,
  createRancherServiceQueryKey,
} from '../../api/services';

export type AccessDetail = {
  username: string;
  password: string;
} | null;

const useCreateRancher = ({
  projectId,
  onSuccess,
  onError,
  onMutate,
}: {
  projectId: string;
  onSuccess: (data: { data: RancherService }) => void;
  onError: (error: ErrorResponse) => void;
  onMutate: () => void;
}) =>
  useMutation<{ data: RancherService }, ErrorResponse, CreateRancherPayload>({
    mutationFn: (data: CreateRancherPayload) =>
      createRancherService({
        projectId,
        data,
      }),
    onSuccess,
    onError,
    onMutate,
    mutationKey: createRancherServiceQueryKey(),
  });

export default useCreateRancher;
