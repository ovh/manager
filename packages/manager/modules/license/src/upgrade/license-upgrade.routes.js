import template from './license-upgrade.html';
import controller from './license-upgrade.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('license.detail.upgrade', {
    url: '/upgrade',
    template,
    controller,
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('license_upgrade'),
    },
  });
};
