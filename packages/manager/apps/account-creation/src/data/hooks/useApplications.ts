import { DefinedInitialDataOptions, useQuery } from '@tanstack/react-query';

import { Application } from '@ovh-ux/manager-config';

import { getApplications } from '@/data/api/applications';

export const useApplications = <Response = Record<string, Application>>(options: Partial<DefinedInitialDataOptions<Record<string, Application>, Error, Response>> = {},) =>
  useQuery({
    ...options,
    queryKey: ['applications'],
    queryFn: getApplications,
  });
