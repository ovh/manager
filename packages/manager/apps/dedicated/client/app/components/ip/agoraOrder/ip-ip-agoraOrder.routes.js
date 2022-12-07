import template from './ip-ip-agoraOrder.html';
import controller from './ip-ip-agoraOrder.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.ip.dashboard.agora-order', {
    url: '/agoraOrder?{catalogName:string}',
    params: {
      service: null,
      user: {},
      catalogName: {
        type: 'string',
        value: 'ip',
      },
    },
    views: {
      modal: {
        template,
        controller,
        controllerAs: 'ctrl',
      },
    },
    resolve: {
      hideBreadcrumb: () => true,
      breadcrumb: () => null,
    },
    layout: 'modal',
    atInternet: {
      rename: 'dedicated::ip::dashboard::order',
    },
  });
};
