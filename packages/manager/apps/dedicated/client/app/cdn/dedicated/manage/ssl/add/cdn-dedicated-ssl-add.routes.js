import template from './cdn-dedicated-ssl-add.html';
import controller from './cdn-dedicated-ssl-add.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.networks.cdn.dedicated.manage.ssl.add', {
    url: '/add',
    template,
    controller,
    layout: 'modal',
    resolve: {
      breadcrumb: () => null,
    },
  });
};
