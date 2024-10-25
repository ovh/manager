import { useQuery } from '@tanstack/react-query';
import { ErrorResponse } from '@/types/api.type';
import { KMSServiceInfos } from '@/types/okmsService.type';
import { getServiceInfos } from '../api/okmsService';

export const getKMSServiceInfosQueryKey = (okmsId: string) => [
  'okms/service/infos',
  okmsId,
];
export const useKMSServiceInfos = (okmId?: string) => {
  return useQuery<{ data: KMSServiceInfos }, ErrorResponse>({
    queryKey: getKMSServiceInfosQueryKey(okmId),
    queryFn: () => getServiceInfos(okmId),
    retry: false,
  });
};
