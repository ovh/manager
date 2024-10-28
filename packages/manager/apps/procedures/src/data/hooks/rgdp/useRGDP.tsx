import { useMutation } from '@tanstack/react-query';
import {
  UploadLink,
  getUploadDocumentsLinks,
  UploadDocuments,
  uploadDocuments,
  finalize,
} from '@/data/api/rgdp/rgdpApi';
import { GDPRValues } from '@/types/gdpr.type';

export const useRGDPSendForm = ({
  onSuccess,
  onError,
}: {
  onSuccess: (links: UploadLink[]) => void;
  onError: () => void;
}) =>
  useMutation({
    mutationFn: (data: GDPRValues) => getUploadDocumentsLinks(data),
    onSuccess: (links) => {
      onSuccess?.(links);
    },
    onError: () => {
      onError?.();
    },
  });

export const useRGDPUploadDocuments = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: () => void;
}) =>
  useMutation({
    mutationFn: async (documents: UploadDocuments) => {
      if (documents.fileLinks.length > 0) {
        await uploadDocuments(documents);
      }
      await finalize();
    },
    onSuccess: () => {
      onSuccess?.();
    },
    onError: () => {
      onError?.();
    },
    retry: 1,
    retryDelay: 3000,
  });
