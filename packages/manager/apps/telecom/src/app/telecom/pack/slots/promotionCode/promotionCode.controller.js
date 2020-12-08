/**
 * @ngdoc controller
 * @name managerApp.contoller:PromotionCodeCtrl
 * @description
 * Promotion Code controller
 */
export default /* @ngInject */ function PromotionCodeCtrl(
  $scope,
  $rootScope,
  $stateParams,
  $translate,
  $uibModal,
  OvhApiPackXdslPromotionCode,
  TucToastError,
) {
  const self = this;

  $scope.$watch('service', (val) => {
    self.amount = val.data.amount;
    self.amount.engagement = val.data.engagement;
    self.proposal = $translate.instant(
      'pack_promotion_code_proposal',
      self.amount,
    );
  });

  /**
   * @ngdoc function
   * @name getPromotion
   * @methodOf managerApp.contoller:PromotionCodeCtrl
   * @description
   * Open a modal to re-engage the customer and generate the promotion code
   */
  this.getPromotion = function getPromotion() {
    $uibModal
      .open({
        templateUrl:
          'app/telecom/pack/slots/promotionCode/promotionCode.modal.html',
        resolve: {
          data() {
            return self.amount;
          },
        },
        controllerAs: 'ctrl',
        controller(data) {
          this.condition = $translate.instant(
            'pack_promotion_code_condition',
            data,
          );
        },
      })
      .result.then(() => {
        self.engageCustomer();
      });
  };

  /**
   * @ngdoc function
   * @name range
   * @methodOf managerApp.contoller:PromotionCodeCtrl
   * @description
   * Launch the re-engagement of the customer
   */
  this.engageCustomer = function engageCustomer() {
    OvhApiPackXdslPromotionCode.v6()
      .generate(
        {
          packId: $stateParams.packName,
        },
        null,
      )
      .$promise.then(() => {
        $rootScope.$broadcast('reload-frames');
      }, TucToastError);
  };
}
