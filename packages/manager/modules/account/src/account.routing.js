export default /* @ngInject */ ($stateProvider) => {
  [
    {
      url: '',
      name: 'account',
      redirectTo: 'account.user',
      resolve: {
        isKycFeatureAvailable: /* @ngInject */ ($http) => {
          return $http
            .get(`/feature/identity-documents/availability`, {
              serviceType: 'aapi',
            })
            .then(
              ({ data: featureAvailability }) =>
                featureAvailability['identity-documents'],
            );
        },
        getKycStatus: /* @ngInject */ (
          $http,
          $q,
          isKycFeatureAvailable,
        ) => () => {
          if (isKycFeatureAvailable) {
            return $http.get(`/me/procedure/identity`).then(({ data }) => data);
          }
          return $q.resolve(false);
        },
        kycStatus: /* @ngInject */ (getKycStatus) => getKycStatus(),
        currentUser: /* @ngInject */ (coreConfig) => coreConfig.getUser(),
        rootState: () => 'app.configuration',
        breadcrumb: () => null,
      },
    },
    {
      abstract: true,
      name: 'account.service',
      template: '<ui-view/>',
    },
  ].forEach((state) => $stateProvider.state(state.name, state));
};
