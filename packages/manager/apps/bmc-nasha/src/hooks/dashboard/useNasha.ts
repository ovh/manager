import { useCallback } from 'react';

import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { aapi } from '@ovh-ux/manager-core-api';

import { prepareNasha } from '@/utils/dashboard/prepareNasha.utils';
import type { Nasha, NashaRaw } from '@/types/Dashboard.type';

export function useNasha(serviceName: string) {
  // Use default namespace for legacy translations (nasha_use_type_*, nasha_datacenter_*, etc.)
  const { t } = useTranslation();

  const queryKey = ['nasha', 'data', serviceName];

  return useQuery({
    queryKey,
    queryFn: async (): Promise<Nasha> => {
      // Reset cache like in AngularJS: aapi.resetCache()
      // In React, we invalidate queries instead
      const response = await aapi.get<NashaRaw>(
        `/dedicated/nasha/${serviceName}`,
      );
      return prepareNasha(response.data, t);
    },
    enabled: !!serviceName,
    select: useCallback(
      (data: Nasha) => data,
      [], // No dependencies needed for select
    ),
  });
}

