import pick from 'lodash/pick';

export default /* @ngInject */ function (
  $q,
  $translate,
  $state,
  $rootScope,
  CucCloudMessage,
  CucVrackService,
  OvhApiOrder,
  coreConfig,
) {
  const self = this;

  self.region = coreConfig.getRegion();

  this.loaders = {
    loading: false,
    validationPending: false,
  };

  this.model = {
    agreements: [],
    contractsAccepted: false,
    purchaseOrderUrl: '',
  };

  this.getVrackContract = function getVrackContract() {
    return OvhApiOrder.Vrack().New().v6().get({
      quantity: 1,
    }).$promise.then((data) => {
      self.model.agreements = data.contracts;
    }).catch((error) => {
      CucCloudMessage.error($translate.instant('vrack_error_reason', { message: error.data.message }));
    });
  };

  this.addVrack = function addVrack() {
    self.loaders.loading = true;
    return OvhApiOrder.Vrack().New().v6().create({
      quantity: this.model.quantityToOrder,
    }, {}).$promise.then((data) => {
      CucCloudMessage.success($translate.instant('vrack_adding_success', { data: pick(data, ['url', 'orderId']) }));
      self.model.purchaseOrderUrl = data.url;
      self.loaders.validationPending = true;
    }).catch((error) => {
      CucCloudMessage.error($translate.instant('vrack_error_reason', { message: error.data.message }));
    }).finally(() => {
      self.loaders.loading = false;
    });
  };

  function init() {
    self.loaders.loading = true;
    self.vrackOrderUrl = null;

    const promise = {
      vrackOrderUrl: CucVrackService.getOrderUrl(),
    };

    if (self.region !== 'US') {
      promise.vrackContract = self.getVrackContract();
    }

    return $q
      .all(promise)
      .then((results) => {
        self.vrackOrderUrl = results.vrackOrderUrl;
      })
      .finally(() => {
        self.loaders.loading = false;
      });
  }

  init();
}
