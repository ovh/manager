import { Handler } from '@playwright-helpers';

export type GetServicesMocksParams = {
  getServicesKo?: boolean;
  updateServicesKo?: boolean;
  deleteServicesKo?: boolean;
};

export const errors = {
  delete: 'Delete services error',
  update: 'Update services error',
  get: 'Get services error',
};

export const getServicesMocks = ({
  getServicesKo,
  updateServicesKo,
  deleteServicesKo,
}: GetServicesMocksParams): Handler[] => [
  {
    url: '/services/:id/terminate',
    response: () =>
      deleteServicesKo
        ? {
            message: errors.delete,
          }
        : null,
    status: deleteServicesKo ? 500 : 200,
    method: 'post',
    api: 'v6',
  },
  {
    url: '/services/:id',
    response: () =>
      updateServicesKo
        ? {
            message: errors.update,
          }
        : null,
    status: updateServicesKo ? 500 : 200,
    method: 'put',
    api: 'v6',
  },
  {
    url: '/services',
    response: () =>
      getServicesKo
        ? {
            message: errors.get,
          }
        : [1234567890],
    status: getServicesKo ? 500 : 200,
    method: 'get',
    api: 'v6',
  },
];
