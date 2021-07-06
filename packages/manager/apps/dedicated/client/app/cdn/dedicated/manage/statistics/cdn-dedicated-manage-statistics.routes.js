import template from './cdn-dedicated-manage-statistics.html';
import controller from './cdn-dedicated-manage-statistics.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.networks.cdn.dedicated.manage.statistics', {
    views: {
      cdnView: {
        template,
        controller,
      },
    },
    resolve: {
      breadcrumb: () => null,
    },
  });
};
