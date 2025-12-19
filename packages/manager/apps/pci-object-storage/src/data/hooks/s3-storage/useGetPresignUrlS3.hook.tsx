import { useMutation } from '@tanstack/react-query';
import { ObjStoError } from '@/data/api';
import storages from '@/types/Storages';
import {
  PresignS3Params,
  getPresignUrlS3,
} from '@/data/api/storage/s3Storage.api';

interface PresignS3WithFile {
  s3Info: PresignS3Params;
  file?: File;
}

interface UseGetPresignUrlS3 {
  onError: (cause: ObjStoError) => void;
  onSuccess: (presignUrl: storages.PresignedURL, file?: File) => void;
}
export function useGetPresignUrlS3({
  onError,
  onSuccess: customOnSuccess,
}: UseGetPresignUrlS3) {
  const mutation = useMutation({
    mutationFn: ({ s3Info }: PresignS3WithFile) => getPresignUrlS3(s3Info),
    onError,
    onSuccess: (presignUrl, variables) => {
      customOnSuccess(presignUrl, variables?.file);
    },
  });

  return {
    getPresignUrlS3: (s3Info: PresignS3Params, file?: File) => {
      return mutation.mutate({ s3Info, file });
    },
    ...mutation,
  };
}
