import { STEPS } from './overTheBox-migration.constant';

export default class OverTheBoxMigrationCtrl {
  /* @ngInject */
  constructor($scope, $translate, TucToast) {
    this.$scope = $scope;
    this.$translate = $translate;
    this.TucToast = TucToast;
  }

  $onInit() {
    this.steps = STEPS;
    this.currentStep = this.steps.offers;

    this.$scope.$on('selectedOffer', (event, offer) => {
      this.offerSelected = offer;
      this.currentStep = this.steps.contact;
    });
  }
}
