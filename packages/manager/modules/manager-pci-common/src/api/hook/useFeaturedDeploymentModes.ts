import { useMemo } from 'react';
import { TRegion } from '@/api/data';
import { usePCIFeatureAvailability } from '@/api/hook/usePCIFeatureAvailability';

import { TDeployment } from '@/dto';

export const DEPLOYMENT_MODES_TYPES: TRegion['type'][] = [
  'region',
  'region-3-az',
  'localzone',
];

export const getDeploymentBetaKey = (name: string) =>
  `public-cloud:deployment-beta-${name}`;
export const getDeploymentComingSoonKey = (name: string) =>
  `public-cloud:deployment-coming-soon-${name}`;

export const DEPLOYMENT_FEATURES = DEPLOYMENT_MODES_TYPES.flatMap((d) => [
  getDeploymentBetaKey(d),
  getDeploymentComingSoonKey(d),
]);

export const useFeaturedDeploymentModes = () => {
  const { data: featureAvailability, ...rest } = usePCIFeatureAvailability(
    DEPLOYMENT_FEATURES,
  );
  const deployments = useMemo<TDeployment[]>(
    () =>
      DEPLOYMENT_MODES_TYPES.map((d) => ({
        name: d,
        beta: featureAvailability?.get(getDeploymentBetaKey(d)) || false,
        comingSoon:
          featureAvailability?.get(getDeploymentComingSoonKey(d)) || false,
      })),
    [featureAvailability],
  );

  return { deployments, ...rest };
};
