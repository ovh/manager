import { TRACKING, SUPPORT_URL } from './constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.kyc-documents.documents', {
    component: 'kycDocuments',
    url: '',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('kyc_documents_breadcrumb'),
      isSupportWithExternalLinks: /* @ngInject */ (coreConfig) =>
        coreConfig.isRegion(['EU', 'CA']),
      supportLink: /* @ngInject */ (
        isSupportWithExternalLinks,
        coreURLBuilder,
      ) =>
        isSupportWithExternalLinks
          ? SUPPORT_URL
          : coreURLBuilder.buildURL('dedicated', '#/support/tickets'),
    },
    atInternet: {
      rename: TRACKING.DOCUMENTS,
    },
  });
};
