import { Handler } from '@ovh-ux/manager-core-test-utils';

export const vrackMocks = [
  {
    serviceName: 'pn-00001',
    description: 'my vrack',
    name: '',
    iam: {
      id: '0000ba00-5f9d-400f-a680-461d1c8c0af8',
      state: 'OK',
      urn: 'urn:v1:eu:resource:vrack:pn-00001',
    },
  },
];

export const getVrackMocks = (): Handler[] => [
  {
    url: '/vrack/:id',
    response: () => {
      return vrackMocks[0];
    },
    status: 200,
    method: 'get',
    api: 'v6',
  },
];
