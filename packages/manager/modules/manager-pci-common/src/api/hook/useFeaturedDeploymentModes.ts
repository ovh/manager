import { useMemo } from 'react';
import { TRegion } from '@/api/data';
import { Deployment } from '@/components/deployment-tiles-input';
import { usePCIFeatureAvailability } from '@/api/hook/usePCIFeatureAvailability';

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
  const deployments = useMemo<Deployment[]>(
    () =>
      DEPLOYMENT_MODES_TYPES.map((d) => ({
        name: d,
        beta:
          featureAvailability &&
          featureAvailability.get(getDeploymentBetaKey(d)),
        comingSoon:
          featureAvailability &&
          featureAvailability.get(getDeploymentComingSoonKey(d)),
      })),
    [featureAvailability],
  );

  return { deployments, ...rest };
};
