import template from './cdn-dedicated-ssl-generate.html';
import controller from './cdn-dedicated-ssl-generate.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.networks.cdn.dedicated.manage.ssl.generate', {
    url: '/generate',
    template,
    controller,
    layout: 'modal',
    resolve: {
      breadcrumb: () => null,
    },
  });
};
