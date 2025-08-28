import React, { useEffect, useMemo, useState } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AxiosMockAdapter from 'axios-mock-adapter';

import { apiClient } from '@ovh-ux/manager-core-api';
import { ServiceDetails, defaultServiceResponse } from '@ovh-ux/manager-module-common-api';
import { ShellContext, ShellContextType } from '@ovh-ux/manager-react-shell-client';

import '../translations';
import {
  serviceEngagedAndContinueResponse,
  serviceEngagedAndEndResponse,
  serviceManualRenewResponse,
  serviceSuspendedResponse,
} from './mockUtils';

type WrapperProps = React.PropsWithChildren & {
  mock?: Partial<ServiceDetails>;
};

export const Wrapper = ({ children, mock = {} }: WrapperProps) => {
  const [queryClient] = useState(new QueryClient());
  const mockAdapter = useMemo(() => new AxiosMockAdapter(apiClient.v6), [apiClient.v6]);

  useEffect(() => {
    mockAdapter.onGet('/services?resourceName=my-resource-name').reply(200, ['01']);
    mockAdapter.onGet('/services/01').reply(200, { ...defaultServiceResponse, ...mock });

    mockAdapter.onGet('/services?resourceName=my-suspended-resource').reply(200, ['02']);
    mockAdapter.onGet('/services/02').reply(200, { ...serviceSuspendedResponse, ...mock });

    mockAdapter.onGet('/services?resourceName=resource-engaged-and-end').reply(200, ['03']);
    mockAdapter.onGet('/services/03').reply(200, { ...serviceEngagedAndEndResponse, ...mock });

    mockAdapter.onGet('/services?resourceName=resource-engaged-and-continue').reply(200, ['04']);
    mockAdapter.onGet('/services/04').reply(200, { ...serviceEngagedAndContinueResponse, ...mock });
    mockAdapter.onGet('/services?resourceName=resource-manual-renew').reply(200, ['05']);
    mockAdapter.onGet('/services/05').reply(200, { ...serviceManualRenewResponse, ...mock });
  }, [mockAdapter, mock]);

  return (
    <ShellContext.Provider
      value={
        {
          shell: { navigation: { getURL: () => '' } },
        } as unknown as ShellContextType
      }
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ShellContext.Provider>
  );
};
