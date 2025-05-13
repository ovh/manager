import template from './cdn-dedicated-manage-ssl.html';
import controller from './cdn-dedicated-manage-ssl.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.networks.cdn.dedicated.manage.ssl', {
    url: '/ssl',
    views: {
      cdnView: {
        template,
        controller,
      },
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('cdn_dedicated_ssl'),
    },
  });
};
