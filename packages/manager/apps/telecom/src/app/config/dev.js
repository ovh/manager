angular.module('managerApp').constant('telecomConfig', {
  env: 'dev',
  aapiRouteBase: '/engine/2api',
  apiRouteBase: '/engine/apiv6',
  apiv7RouteBase: '/engine/apiv7',
  wsRouteBase: '/engine/ws',
  loginUrl: '/auth',
  cookieSessionName: 'APIV6_SESSION',
});
