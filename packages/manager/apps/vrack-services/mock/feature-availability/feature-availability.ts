import { Handler } from '@playwright-helpers';

export const featureAvailabilityMock = { 'vrack-services:order': true };

export const getFeatureAvailabilityMock = (): Handler[] => [
  {
    url: '/feature/vrack-services:order/availability',
    response: featureAvailabilityMock,
    status: 200,
    method: 'get',
    api: 'aapi',
  },
];
