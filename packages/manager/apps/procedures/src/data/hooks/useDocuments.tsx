import { useMutation } from '@tanstack/react-query';
import {
  getUploadDocumentsLinks,
  uploadDocuments,
  UploadLink,
} from '../api/documentsApi';

type UploadDocumentsProps = {
  files: File[];
  links: UploadLink[];
};

export const useUploadLinks = ({
  onSuccess,
  onError,
}: {
  onSuccess: (links: UploadLink[]) => void;
  onError: () => void;
}) =>
  useMutation({
    mutationFn: (numberOfDocuments: number) =>
      getUploadDocumentsLinks(numberOfDocuments),
    onSuccess: (links) => {
      onSuccess?.(links);
    },
    onError: () => {
      onError?.();
    },
  });

export const useUploadDocuments = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: () => void;
}) =>
  useMutation({
    mutationFn: ({ files, links }: UploadDocumentsProps) => {
      return uploadDocuments(files, links);
    },
    onSuccess: () => {
      onSuccess?.();
    },
    onError: () => {
      // TODO: add logs to better understand what is going wrong on procedure finalization (MANAGER-15281)
      onError?.();
    },
    retry: 1,
    retryDelay: 3000,
  });
