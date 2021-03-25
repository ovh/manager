import controller from './cda-pool-list.controller';
import template from './cda-pool-list.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('cda.dashboard.cda-pool', {
    url: '/pool',
    views: {
      cdaDetailsTab: {
        template,
        controller,
        controllerAs: 'CdaPoolListCtrl',
      },
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('cda_pool_breadcrumb'),
    },
  });
};
