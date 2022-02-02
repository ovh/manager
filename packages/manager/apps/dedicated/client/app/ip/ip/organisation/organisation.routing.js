import controller from './ip-ip-organisation.controller';
import template from './ip-ip-organisation.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.ip.dashboard.organisation', {
    url: '/organisation',
    template,
    controller,
    controllerAs: '$ctrl',
    reloadOnSearch: false,
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('ip_organisation'),
    },
    atInternet: {
      rename: 'dedicated::ip::dashboard::organisation',
    },
  });
};
