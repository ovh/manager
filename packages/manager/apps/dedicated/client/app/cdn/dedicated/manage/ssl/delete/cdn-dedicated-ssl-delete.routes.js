import template from './cdn-dedicated-ssl-delete.html';
import controller from './cdn-dedicated-ssl-delete.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.networks.cdn.dedicated.manage.ssl.delete', {
    url: '/delete',
    template,
    controller,
    layout: 'modal',
    resolve: {
      breadcrumb: () => null,
    },
  });
};
