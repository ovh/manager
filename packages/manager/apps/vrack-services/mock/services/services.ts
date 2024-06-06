import { Handler } from '@playwright-helpers';

export type GetServicesMocksParams = {
  servicesKo?: boolean;
};

export const getServicesMocks = ({
  servicesKo,
}: GetServicesMocksParams): Handler[] => [
  {
    url: '/services/:id/terminate',
    response: () =>
      servicesKo
        ? {
            message: 'Services error',
          }
        : null,
    status: servicesKo ? 500 : 200,
    method: 'post',
    api: 'v6',
  },
  {
    url: '/services/:id',
    response: () =>
      servicesKo
        ? {
            message: 'Services error',
          }
        : null,
    status: servicesKo ? 500 : 200,
    method: 'put',
    api: 'v6',
  },
  {
    url: '/services',
    response: () =>
      servicesKo
        ? {
            message: 'Services error',
          }
        : [1234567890],
    status: servicesKo ? 500 : 200,
    method: 'get',
    api: 'v6',
  },
];
