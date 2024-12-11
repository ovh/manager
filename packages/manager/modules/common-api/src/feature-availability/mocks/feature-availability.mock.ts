import { Handler } from '@ovh-ux/manager-core-test-utils';

export type GetFeatureAvailabilityMocksParams = {
  isFeatureAvailabilityServiceKo?: boolean;
  featureAvailabilityResponse?: Record<string, boolean>;
};

export const featureAvailabilityError = 'Feature availability service error';

export const getFeatureAvailabilityMocks = ({
  isFeatureAvailabilityServiceKo,
  featureAvailabilityResponse = {},
}: GetFeatureAvailabilityMocksParams): Handler[] => [
  {
    url: `/feature/${Object.keys(featureAvailabilityResponse).join(
      ',',
    )}/availability`,
    response: () =>
      isFeatureAvailabilityServiceKo
        ? {
            message: featureAvailabilityError,
          }
        : featureAvailabilityResponse,
    status: isFeatureAvailabilityServiceKo ? 500 : 200,
    method: 'get',
    api: 'aapi',
  },
];
