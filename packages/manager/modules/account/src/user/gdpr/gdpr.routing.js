import { CREATE_ERASURE_REQUEST_ACTION } from './gdpr.constants';
import confirmRequestController from './confirm/confirm-request-erasure.controller.js';
import confirmRequestTemplate from './confirm/confirm-request-erasure.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('account.user.gdpr', {
    url: '/personal-data',
    component: 'gdprFeatures',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('user_account_gdpr_features_title'),
      canCreateErasureRequest: /* @ngInject */ (iamAuthorizations) =>
        iamAuthorizations.authorizedActions.includes(
          CREATE_ERASURE_REQUEST_ACTION,
        ),
    },
  });

  $stateProvider.state('account.user.gdpr.confirm', {
    url: '/:publicId/confirm-request-erasure',
    template: confirmRequestTemplate,
    controller: confirmRequestController,
    controllerAs: '$ctrl',
    resolve: {
      publicId: /* @ngInject */ ($transition$) =>
        $transition$.params().publicId,
      breadcrumb: /* @ngInject */ () => null,
    },
  });
};
