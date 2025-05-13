import controller from './cda-user-list.controller';
import template from './cda-user.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('cda.dashboard.cda-user', {
    url: '/user',
    views: {
      cdaDetailsTab: {
        controller,
        controllerAs: 'CdaUserListCtrl',
        template,
      },
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('cda_user_breadcrumb'),
    },
  });
};
