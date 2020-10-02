import template from './ip-ip-organisation.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.ip.dashboard.organisation', {
    url: '/organisation',
    template,
    controller: 'IpOrganisationCtrl',
    controllerAs: '$ctrl',
    reloadOnSearch: false,
  });
};
