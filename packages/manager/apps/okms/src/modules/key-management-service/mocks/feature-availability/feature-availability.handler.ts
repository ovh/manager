import { Handler } from '@ovh-ux/manager-core-test-utils';
import { featuresAvailabilityMock } from './feature-availability.mock';

export type GetFeatureAvailabilityMocksParams = {
  isFeatureAvailabilityKO?: boolean;
  feature?: string;
};

const findAvailabilityByFeature = (feature: string | undefined) => {
  if (!feature) return {};

  return {
    [feature]: featuresAvailabilityMock[feature] ?? false,
  };
};

export const getFeatureAvailabilityMocks = ({
  isFeatureAvailabilityKO,
  feature,
}: GetFeatureAvailabilityMocksParams): Handler[] => [
  {
    url: '/feature/:feature/availability',
    response: isFeatureAvailabilityKO
      ? {
          status: 500,
          data: {
            message: 'feature availability error',
          },
        }
      : () => findAvailabilityByFeature(feature),
    status: isFeatureAvailabilityKO ? 500 : 200,
    api: 'aapi',
  },
];
