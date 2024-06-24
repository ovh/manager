import { useQuery } from '@tanstack/react-query';
import { OKMS } from '@/types/okms.interface';
import { ErrorResponse } from '@/types/api.interface';
import { KMSServiceInfos } from '@/types/okmsService.interface';
import { getServiceInfos } from '../okmsService';

export const useKMSServiceInfos = (okms: OKMS) => {
  return useQuery<{ data: KMSServiceInfos }, ErrorResponse>({
    queryKey: ['okms/service/infos', okms.id],
    queryFn: () => getServiceInfos({ okms: okms.id }),
    retry: false,
    ...{
      keepPreviousData: true,
    },
  });
};
