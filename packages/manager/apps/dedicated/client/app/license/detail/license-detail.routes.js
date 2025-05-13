import template from './license-detail.html';
import controller from './license-detail.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.license.detail', {
    url: '/:licenseId',
    template,
    controller,
    resolve: {
      licenseId: /* @ngInject */ ($transition$) =>
        $transition$.params().licenseId,
      breadcrumb: /* @ngInject */ (licenseId) => licenseId,
    },
  });

  $stateProvider.state('app.license.detail.redirection', {
    url: '/detail',
    redirectTo: 'app.license.detail',
  });
};
