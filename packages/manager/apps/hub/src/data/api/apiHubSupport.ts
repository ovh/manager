import { aapi } from '@ovh-ux/manager-core-api';
import { SupportResponse } from '@/types/support.type';
import { ApiEnvelope } from '@/types/apiEnvelope.type';

export const getHubSupport: (
  cached: boolean,
) => Promise<ApiEnvelope<SupportResponse>> = async (cached: boolean) => {
  const { data } = await aapi.get<ApiEnvelope<SupportResponse>>(
    '/hub/support',
    !cached && {
      headers: {
        Pragma: 'no-cache',
      },
    },
  );
  if (data?.data?.support?.status === 'ERROR') {
    throw new Error();
  }
  return data;
};
