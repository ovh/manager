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
      needkyc: /* @ngInject */ ($http) => {
        return $http
          .get(`/feature/identity-documents/availability`, {
            serviceType: 'aapi',
          })
          .then(({ data: featureAvailability }) => {
            if (featureAvailability['identity-documents']) {
              return $http
                .get(`/me/procedure/identity`)
                .then(({ data }) => ['required'].includes(data.status));
            }
            return false;
          });
      },
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('user_account_identity_documents'),
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('needkyc')
        .then((needkyc) => (needkyc ? false : { state: 'app.account' })),
  });
};
