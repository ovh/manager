import { DefinedInitialDataOptions, useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { SupportDataResponse, SupportResponse } from '@/types/support.type';
import { getHubSupport } from '@/data/api/apiHubSupport';
import queryClient from '@/queryClient';
import { ApiEnvelope } from '@/types/apiEnvelope.type';

const queryKey = ['get-hub-support'];

type ApiResponse = AxiosResponse<ApiEnvelope<SupportResponse>>;

const DEFAULT_RESULT: SupportDataResponse = {
  data: [],
  count: 0,
};

export const useFetchHubSupport = (
  options?: Partial<
    DefinedInitialDataOptions<ApiResponse, any, SupportDataResponse>
  >,
) =>
  useQuery({
    queryKey,
    queryFn: () => {
      const hasBeenFetched = Boolean(queryClient.getQueryData(queryKey));
      return getHubSupport(!hasBeenFetched);
    },
    select: ({ data }: ApiResponse) =>
      data?.data?.support?.data ?? DEFAULT_RESULT,
    ...(options ?? {}),
  });
