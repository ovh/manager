angular.module('App').component('configuration', {
  bindings: {
    user: '<',
    isOffersBannerActive: '<',
  },
  controller: 'configurationCtrl',
  templateUrl: 'configuration/configuration.html',
});
