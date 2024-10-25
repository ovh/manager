import { useQuery } from '@tanstack/react-query';
import { OKMS } from '@/types/okms.type';
import { ErrorResponse } from '@/types/api.type';
import { KMSServiceInfos } from '@/types/okmsService.type';
import { getServiceInfos } from '../api/okmsService';

export const useKMSServiceInfos = (okms?: OKMS) => {
  return useQuery<{ data: KMSServiceInfos }, ErrorResponse>({
    queryKey: ['okms/service/infos', okms?.id],
    queryFn: () => getServiceInfos({ okms: okms?.id }),
    retry: false,
    ...{
      keepPreviousData: true,
    },
  });
};
