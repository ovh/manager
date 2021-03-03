import controller from './cda-ip-list.controller';
import template from './cda-ip-list.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('cda.dashboard.cda-ip', {
    url: '/ip',
    views: {
      cdaDetailsTab: {
        template,
        controller,
        controllerAs: 'CdaIpListCtrl',
      },
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('cda_ip_breadcrumb'),
    },
  });
};
