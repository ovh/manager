import { TRACKING_PREFIX } from './user-identity-documents.constant';

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
      needkyc: /* @ngInject */ (isKycFeatureAvailable, kycStatus) => {
        if (isKycFeatureAvailable) {
          return ['required', 'open'].includes(kycStatus.status);
        }
        return false;
      },
      breadcrumb: /* @ngInject */ () => null,
    },
    atInternet: {
      rename: TRACKING_PREFIX,
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('needkyc')
        .then((needkyc) => (needkyc ? false : { state: 'app.account' })),
  });
};
