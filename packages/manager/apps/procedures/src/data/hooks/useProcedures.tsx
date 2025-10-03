import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { UploadDocuments, UploadLink, getProceduresAPI } from '@/data/api/proceduresApi';
import { Procedure } from '@/types/procedure';

export const useProcedures = (procedure: Procedure) => {
  const { getStatus, getDocumentsLinks, uploadDocuments } = getProceduresAPI(procedure);

  const useStatus = <TResponse,>() =>
    useQuery<TResponse, AxiosError>({
      queryKey: ['getStatus', procedure],
      queryFn: getStatus,
      retry: 0,
    });

  const useUploadLinks = <TData extends { numberOfDocuments: number }>({
    onSuccess,
    onError,
  }: {
    onSuccess: (links: UploadLink[]) => void;
    onError: () => void;
  }) =>
    useMutation({
      mutationFn: (data: TData) => getDocumentsLinks(data),
      onSuccess: (links) => {
        onSuccess?.(links);
      },
      onError: () => {
        onError?.();
      },
      retry: 1,
      retryDelay: 3000,
    });

  const useUploadDocuments = ({
    onSuccess,
    onError,
  }: {
    onSuccess: () => void;
    onError: () => void;
  }) =>
    useMutation({
      mutationFn: (documentsData: UploadDocuments) => {
        return uploadDocuments(documentsData);
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
  return {
    useStatus,
    useUploadLinks,
    useUploadDocuments,
  };
};
