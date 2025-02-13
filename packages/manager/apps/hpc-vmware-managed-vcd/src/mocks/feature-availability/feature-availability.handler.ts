import { Handler } from '@ovh-ux/manager-core-test-utils';

export type TFeatureAvailabilityMockParams = {
  feature?: Record<string, boolean>;
};

export const getFeatureAvailabilityMocks = ({
  feature,
}: TFeatureAvailabilityMockParams): Handler[] => [
  {
    url: '/feature/:feature/availability',
    response: () => feature ?? {},
    api: 'aapi',
    method: 'get',
    status: 200,
  },
];
