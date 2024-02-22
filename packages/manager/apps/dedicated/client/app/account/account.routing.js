export default /* @ngInject */ ($stateProvider) => {
  [
    {
      abstract: true,
      name: 'app.account',
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
        kycStatus: /* @ngInject */ ($http, isKycFeatureAvailable) => {
          if (isKycFeatureAvailable) {
            return $http.get(`/me/procedure/identity`).then(({ data }) => data);
          }
          return false;
        },
      },
    },
    {
      abstract: true,
      name: 'app.account.service',
      template: '<ui-view/>',
    },
  ].forEach((state) => $stateProvider.state(state.name, state));
};
