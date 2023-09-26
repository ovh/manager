import template from './GENERAL_INFORMATIONS.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.dashboard.general-informations', {
    url: '',
    controller: 'hostingGeneralInformationsCtrl',
    controllerAs: '$ctrl',
    template,
    resolve: {
      breadcrumb: () => null,
      displayNewHostingOfferSticker: /* @ngInject */ (ovhFeatureFlipping) =>
        ovhFeatureFlipping
          .checkFeatureAvailability('hosting:new-offer-sticker')
          .then((featureAvailability) =>
            featureAvailability.isFeatureAvailable('hosting:new-offer-sticker'),
          ),
    },
  });
};
