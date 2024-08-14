import { useMutation, useQuery } from '@tanstack/react-query';
import { uploadDocuments } from '../api/documentsApi';

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
      return uploadDocuments(files);
    },
    onSuccess: () => {
      onSuccess?.();
    },
    onError: () => {
      onError?.();
    },
  });
