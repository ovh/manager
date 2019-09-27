angular.module('managerApp').constant('CONFIG', {
  env: 'development',
})
  .constant('CONFIG_API', {
    apis: [
      {
        serviceType: 'apiv6',
        urlPrefix: '/engine/apiv6',
      },
      {
        serviceType: 'aapi',
        urlPrefix: '/engine/2api',
      },
      {
        serviceType: 'apiv7',
        urlPrefix: '/engine/apiv7',
      },
    ],
    loginUrl: '/auth',
    userUrl: '/engine/apiv6/me',
  });
