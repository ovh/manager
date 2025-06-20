import { Handler } from '@ovh-ux/manager-core-test-utils';

export const getCloudProjectMocks = (): Handler[] => [
  {
    url: '/cloud/project',
    response: [{ serviceName: 'ns123456.ip-239-99-244.net' }],
    api: 'v6',
  },
];
