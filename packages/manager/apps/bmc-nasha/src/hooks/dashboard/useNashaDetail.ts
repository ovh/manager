import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { aapi } from '@ovh-ux/manager-core-api';

import { APP_FEATURES } from '@/App.constants';
import { NASHA_USE_SIZE_NAME } from '@/constants/Nasha.constants';

type NashaUse = {
  [key: string]: {
    unit: string;
    value: number;
    name?: string;
  };
};

type NashaApiResponse = {
  serviceName: string;
  customName?: string;
  datacenter: string;
  diskType: string;
  zpoolSize: number;
  use: NashaUse;
  [key: string]: unknown;
};

export type PreparedNasha = {
  serviceName: string;
  customName?: string;
  datacenter: string;
  diskType: string;
  zpoolSize: number;
  localeDatacenter: string;
  diskSize: string;
  use: NashaUse;
};

const QUERY_KEY = (serviceName: string) => ['nasha-detail', serviceName] as const;

/**
 * Prepare use object with translated names and units
 */
function prepareUse(use: NashaUse, t: (key: string) => string): NashaUse {
  if (!use) return {};
  return Object.keys(use).reduce(
    (result, type) => ({
      ...result,
      [type]: {
        ...use[type],
        name: (() => {
          const key = `nasha_use_type_${type}`;
          const name = t(key);
          return name === key ? type : name;
        })(),
        unit: t(`nasha_use_unit_${use[type]?.unit ?? 'B'}`),
      },
    }),
    {},
  );
}

/**
 * Hook to fetch and prepare NASHA service details
 * Equivalent to the nasha resolve in dashboard.routing.js
 */
export function useNashaDetail(serviceName: string) {
  const { t, i18n } = useTranslation(['common', 'nasha']);

  return useQuery<PreparedNasha>({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: [...QUERY_KEY(serviceName), i18n.language],
    queryFn: async () => {
      // Use AAPI endpoint like AngularJS does
      const { data } = await aapi.get<NashaApiResponse>(
        `${APP_FEATURES.listingEndpoint}/${serviceName}`,
      );

      // Prepare data like prepareNasha function
      const useSize = data.use?.[NASHA_USE_SIZE_NAME];
      const preparedUse = prepareUse(data.use, t);

      return {
        ...data,
        use: preparedUse,
        localeDatacenter: t(`nasha_datacenter_${data.datacenter.toLowerCase()}`),
        diskSize: useSize ? `${useSize.value} ${t(`nasha_use_unit_${useSize.unit}`)}` : '-',
      };
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: false,
  });
}
