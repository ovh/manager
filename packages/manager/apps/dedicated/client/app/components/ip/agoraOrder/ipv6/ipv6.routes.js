import template from './ipv6.html';
import controller from './ipv6.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.ip.agora-order.ipv6', {
    url: '/ipv6',
    views: {
      '': {
        controller,
        template,
        controllerAs: '$ctrl',
      }
    },
    resolve: {
      breadcrumb: /* @ngInject */ () => false,
    },
    atInternet: {
      rename: 'dedicated::ip::dashboard::order::ipv6',
    },
  });
};
