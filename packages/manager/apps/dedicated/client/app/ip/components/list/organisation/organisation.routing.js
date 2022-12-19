import controller from './ip-ip-organisation.controller';
import template from './ip-ip-organisation.html';
import { listRouting } from '../../../ip.routing';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.ip.organisation', {
    url: '/organisation',
    views: {
      ipview: {
        template,
        controller,
        controllerAs: '$ctrl',
      },
    },
    reloadOnSearch: false,
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('ip_organisation'),
      goToDashboard: listRouting.resolve.goToDashboard,
    },
    atInternet: {
      rename: 'dedicated::ip::dashboard::organisation',
    },
  });
};
