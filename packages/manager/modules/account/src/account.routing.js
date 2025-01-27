import { FEATURES, KYC_INDIA_FEATURE } from './account.constants';

export default /* @ngInject */ ($stateProvider) => {
  [
    {
      url: '',
      name: 'account',
      redirectTo: 'account.user',
      resolve: {
        featureAvailability: /* @ngInject */ ($http) =>
          $http
            .get(`/feature/${FEATURES.join(',')}/availability`, {
              serviceType: 'aapi',
            })
            .then(({ data }) => data),
        isKycFeatureAvailable: /* @ngInject */ (featureAvailability) =>
          featureAvailability[KYC_INDIA_FEATURE] || false,
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
