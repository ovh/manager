import template from './GENERAL_INFORMATIONS.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.dashboard.general-informations', {
    url: '',
    controller: 'hostingGeneralInformationsCtrl',
    controllerAs: '$ctrl',
    template,
    resolve: {
      isChangeOfferFeatureAvailable: /* @ngInject */ (ovhFeatureFlipping) =>
        ovhFeatureFlipping
          .checkFeatureAvailability('web-hosting:change-offer')
          .then((featureAvailability) => {
            return featureAvailability.isFeatureAvailable(
              'web-hosting:change-offer',
            );
          }),
      isManageRenewFeatureAvailable: /* @ngInject */ (ovhFeatureFlipping) =>
        ovhFeatureFlipping
          .checkFeatureAvailability('web-hosting:manage-renew')
          .then((featureAvailability) => {
            return featureAvailability.isFeatureAvailable(
              'web-hosting:manage-renew',
            );
          }),
      breadcrumb: () => null,
    },
  });
};
