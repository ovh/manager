import template from './cdn-dedicated-manage-logs.html';
import controller from './cdn-dedicated-manage-logs.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.networks.cdn.dedicated.manage.logs', {
    url: '/logs',
    views: {
      cdnView: {
        template,
        controller,
        controllerAs: '$ctrl',
      },
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('cdn_tabs_logs'),
    },
  });
};
