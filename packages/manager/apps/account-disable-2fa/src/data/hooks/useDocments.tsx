import { useMutation, useQuery } from '@tanstack/react-query';
import { uploadDcouments } from '../api/documentsApi';

type UploadDocumentsProps = {
  files: File[];
};

export const useUploadDocuments = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: () => void;
}) =>
  useMutation({
    mutationFn: ({ files }: UploadDocumentsProps) => {
      return uploadDcouments(files);
    },
    onSuccess: () => {
      onSuccess?.();
    },
    onError: () => {
      onError?.();
    },
  });
