import { useQuery } from '@tanstack/react-query';
import { OKMS } from '@/types/okms.type';
import { ErrorResponse } from '@/types/api.type';
import { KMSServiceInfos } from '@/types/okmsService.type';
import { getServiceInfos } from '../api/okmsService';

export const getKMSServiceInfosQueryKey = (okmsId: string) => {
  return ['okms/service/infos', okmsId];
};
export const useKMSServiceInfos = (okms?: OKMS) => {
  return useQuery<{ data: KMSServiceInfos }, ErrorResponse>({
    queryKey: getKMSServiceInfosQueryKey(okms?.id),
    queryFn: () => getServiceInfos(okms?.id),
    retry: false,
  });
};
