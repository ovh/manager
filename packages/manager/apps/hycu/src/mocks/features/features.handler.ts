import { PathParams } from 'msw';
import { Handler } from '@ovh-ux/manager-core-test-utils';

export const getFeaturesMocks = (): Handler[] => [
  {
    url: '/feature/:feature/availability',
    response: (_: unknown, params: PathParams) => [params.feature],
    api: 'aapi',
    method: 'get',
  },
];
