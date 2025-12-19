import { useMutation } from '@tanstack/react-query';
import { ObjStoError } from '@/data/api';
import { AddS3Policy, addS3UserPolicy } from '@/data/api/storage/s3Storage.api';

interface UseAddS3Policy {
  onError: (cause: ObjStoError) => void;
  onSuccess: () => void;
}
export function useAddS3Policy({
  onError,
  onSuccess: customOnSuccess,
}: UseAddS3Policy) {
  const mutation = useMutation({
    mutationFn: (userInfo: AddS3Policy) => {
      return addS3UserPolicy(userInfo);
    },
    onError,
    onSuccess: () => {
      customOnSuccess();
    },
  });

  return {
    addS3Policy: (userInfo: AddS3Policy) => {
      return mutation.mutate(userInfo);
    },
    ...mutation,
  };
}
