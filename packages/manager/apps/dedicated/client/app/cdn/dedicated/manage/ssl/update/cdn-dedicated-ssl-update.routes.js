import template from './cdn-dedicated-ssl-update.html';
import controller from './cdn-dedicated-ssl-update.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.networks.cdn.dedicated.manage.ssl.update', {
    url: '/update',
    template,
    controller,
    layout: 'modal',
    resolve: {
      breadcrumb: () => null,
    },
  });
};
