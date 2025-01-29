import { PathParams } from 'msw';
import { Handler } from '@ovh-ux/manager-core-test-utils';
import { featuresAvailabilityMock } from './feature-availability.mock';

export type GetFeatureAvailabilituMocksParams = {
  isFeatureAvailabilityKO?: boolean;
};

const findAvailavilityByFeature = (params: PathParams) =>
  featuresAvailabilityMock[params.feature.toString()];

export const getFeatureAvailabilityMocks = ({
  isFeatureAvailabilityKO,
}: GetFeatureAvailabilituMocksParams): Handler[] => [
  {
    url: '/feature/:feature/availability',
    response: isFeatureAvailabilityKO
      ? {
          status: 500,
          data: {
            message: 'feature availability error',
          },
        }
      : (_: unknown, params: PathParams) => findAvailavilityByFeature(params),
    status: isFeatureAvailabilityKO ? 500 : 200,
    api: 'aapi',
  },
];
