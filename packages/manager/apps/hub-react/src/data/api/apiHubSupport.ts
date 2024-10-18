import { aapi } from '@ovh-ux/manager-core-api';
import { AxiosResponse } from 'axios';
import { SupportResponse } from '@/types/support.type';
import { ApiEnvelope } from '@/types/apiEnvelope.type';

export const getHubSupport: (
  cached: boolean,
) => Promise<AxiosResponse<ApiEnvelope<SupportResponse>>> = (cached: boolean) =>
  aapi.get(
    '/hub/support',
    !cached && {
      headers: {
        Pragma: 'no-cache',
      },
    },
  );
