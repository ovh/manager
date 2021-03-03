angular.module('App').controller(
  'BillingMainCtrl',
  class BillingMainCtrl {
    /* @ngInject */
    constructor(isPayAsYouGoAvailable) {
      this.isPayAsYouGoAvailable = isPayAsYouGoAvailable;
    }
  },
);
