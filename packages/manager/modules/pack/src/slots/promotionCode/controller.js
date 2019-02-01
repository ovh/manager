import template from './template.modal.html';

export default class {
  /* @ngInject; */
  constructor(
    $rootScope,
    $translate,
    $uibModal,
    OvhApiPackXdslPromotionCode,
    TucToastError,
  ) {
    this.$rootScope = $rootScope;
    this.$translate = $translate;
    this.$uibModal = $uibModal;
    this.OvhApiPackXdslPromotionCode = OvhApiPackXdslPromotionCode;
    this.TucToastError = TucToastError;
  }

  $onInit() {
    this.amount = {
      ...this.service.data.amount,
      engagement: this.service.data.engagement,
    };
    this.proposal = this.$translate.instant('pack_promotion_code_proposal', this.amount);
  }

  getPromotion() {
    this.$uibModal
      .open({
        template,
        resolve: {
          data() {
            return this.amount;
          },
        },
        controller(data) {
          this.condition = this.$translate.instant('pack_promotion_code_condition', data);
        },
      })
      .result
      .then(() => {
        this.engageCustomer();
      });
  }

  engageCustomer() {
    return this.OvhApiPackXdslPromotionCode
      .v6()
      .generate(
        {
          packId: this.pack.packName,
        },
        null,
      )
      .$promise
      .then(() => {
        this.$rootScope.$broadcast('reload-frames');
      }, this.TucToastError);
  }
}
