import template from './ip-ip-agoraOrder.html';
import controller from './ip-ip-agoraOrder.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.ip.dashboard.agora-order', {
    url: '/agoraOrder?{catalogName:string}',
    template,
    controller,
    controllerAs: '$ctrl',
    params: {
      service: null,
      user: {},
      catalogName: {
        type: 'string',
        value: 'ip',
      },
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('license_dashboard_title'),
    },
    atInternet: {
      rename: 'dedicated::ip::dashboard::order',
    },
  });
};
