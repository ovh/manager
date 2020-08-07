import template from './ENVVARS.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.dashboard.envvars', {
    url: '/envvars',
    controller: 'HostingEnvvarsCtrl',
    template,
  });
};
