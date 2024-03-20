import template from './ipv4.html';
import controller from './ipv4.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.ip.agora-order.ipv4', {
    url: '/ipv4',
    views: {
      '': {
        template,
        controller,
        controllerAs: '$ctrl',
      },
    },
    params: {
      service: null,
      user: {},
      catalogName: {
        type: 'string',
        value: 'ip',
      },
    },
    resolve: {
      breadcrumb: /* @ngInject */ () => false,
    },
    atInternet: {
      rename: 'dedicated::ip::dashboard::order::ipv4',
    },
  });
};
