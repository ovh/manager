export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.kyc-documents.documents', {
    component: 'kycDocuments',
    url: '',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('kyc_documents_breadcrumb'),
    },
  });
};
