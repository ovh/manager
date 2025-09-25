import { Handler } from '@ovh-ux/manager-core-test-utils';

export const getCloudProjectMocks = (): Handler[] => [
  {
    url: '/cloud/project',
    response: [
      {
        serviceName: 'cp12346.ip-239-99-244.net',
        description: 'My Cloud project',
        iam: {
          urn: 'test:cp12346.ip-239-99-244.net',
        },
      },
    ],
    api: 'v6',
  },
];
