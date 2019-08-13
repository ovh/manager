angular.module('managerApp').constant('telecomConfig', {
  env: 'prod',
  aapiRouteBase: '/engine/2api',
  apiRouteBase: '/engine/apiv6',
  apiv7RouteBase: '/engine/apiv7',
  wsRouteBase: '/engine/ws',
  loginUrl: 'https://www.ovh.com/auth',
  cookieSessionName: 'APIV6_SESSION',
});
