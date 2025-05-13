import controller from './cda-user-details.controller';
import template from './cda-user-details.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('cda.dashboard.cda-user.cda-user-details', {
    url: '/:userName',
    views: {
      cdaUserContent: {
        template,
        controller,
        controllerAs: 'CdaUserDetailsCtrl',
      },
    },
    redirectTo: 'cda.dashboard.cda-user',
    resolve: {
      userName: /* @ngInject */ ($transition$) =>
        $transition$.params().userName,
      breadcrumb: /* @ngInject */ (userName) => userName,
    },
  });
};
