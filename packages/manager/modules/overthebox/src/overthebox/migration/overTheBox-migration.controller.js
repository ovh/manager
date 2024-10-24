import { STEPS, NO_HARDWARE } from './overTheBox-migration.constant';

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

      if (this.offerSelected.selectedHardwareName !== NO_HARDWARE) {
        this.currentStep = this.steps.contact;
      } else {
        this.currentStep = this.steps.summary;
      }
    });
    this.$scope.$on('selectedContact', (event, contact) => {
      this.contactSelected = contact;
      this.currentStep = this.steps.summary;
    });
  }
}
