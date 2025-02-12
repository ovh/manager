import { CREATE_ERASURE_REQUEST_ACTION } from './gdpr.constants';

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
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('canManageGdprRequests')
        .then((canManageGdprRequests) =>
          !canManageGdprRequests ? { state: 'account.user' } : false,
        ),
  });
};
