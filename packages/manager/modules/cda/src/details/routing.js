import controller from './cda-details.controller';
import template from './cda-details.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('cda.dashboard', {
    url: '/:serviceName',
    redirectTo: 'cda.dashboard.cda-details-home',
    views: {
      cdaDetails: {
        template,
        controller,
        controllerAs: 'CdaDetailsCtrl',
      },
    },
    resolve: {
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceName,
      breadcrumb: /* @ngInject */ (serviceName) => serviceName,
    },
  });
};
