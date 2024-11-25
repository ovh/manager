import { TRACKING } from './constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('account.kyc-documents.documents', {
    component: 'kycDocuments',
    url: '',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('kyc_documents_breadcrumb'),
      supportLink: /* @ngInject */ (coreURLBuilder) =>
        coreURLBuilder.buildURL('dedicated', '#/support/tickets'),
    },
    atInternet: {
      rename: TRACKING.DOCUMENTS,
    },
  });
};
