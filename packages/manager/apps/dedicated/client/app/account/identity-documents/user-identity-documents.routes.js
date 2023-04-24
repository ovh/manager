export default /* @ngInject */ ($stateProvider) => {
  const name = 'app.account.identity-documents';

  $stateProvider.state(name, {
    url: '/identity-documents',
    component: 'dedicatedAccountUserIdentityDocuments',
    translations: {
      format: 'json',
      value: ['.'],
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('user_account_identity_documents'),
    },
  });
};
