import { useMutation } from '@tanstack/react-query';
import {
  sendForm,
  UploadLink,
  getUploadDocumentsLinks,
  FormValue,
} from '@/data/api/rgdp/rgdpApi';

export const useRGDPUploadLinks = ({
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

export const useRGDPSendForm = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: () => void;
}) =>
  useMutation({
    mutationFn: (value: FormValue) => {
      return sendForm(value);
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
