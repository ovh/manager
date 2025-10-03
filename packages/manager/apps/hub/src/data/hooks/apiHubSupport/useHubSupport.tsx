import { DefinedInitialDataOptions, useQuery } from '@tanstack/react-query';

import { getHubSupport } from '@/data/api/apiHubSupport';
import queryClient from '@/queryClient';
import { ApiEnvelope } from '@/types/apiEnvelope.type';
import { SupportDataResponse, SupportResponse } from '@/types/support.type';

const queryKey = ['get-hub-support'];

const DEFAULT_RESULT: SupportDataResponse = {
  data: [],
  count: 0,
};

export const useFetchHubSupport = (
  options?: Partial<
    DefinedInitialDataOptions<ApiEnvelope<SupportResponse>, any, SupportDataResponse>
  >,
) =>
  useQuery({
    queryKey,
    queryFn: () => {
      const hasBeenFetched = Boolean(queryClient.getQueryData(queryKey));
      return getHubSupport(!hasBeenFetched);
    },
    select: ({ data }: ApiEnvelope<SupportResponse>) => data?.support?.data ?? DEFAULT_RESULT,
    ...(options ?? {}),
  });
