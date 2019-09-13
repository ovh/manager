(() => {
  class VeeamUpdateOfferCtrl {
    constructor($uibModalInstance, serviceName, CucControllerHelper, VeeamService) {
      this.$uibModalInstance = $uibModalInstance;
      this.serviceName = serviceName;
      this.CucControllerHelper = CucControllerHelper;
      this.VeeamService = VeeamService;

      this.orderInfo = this.CucControllerHelper.request
        .getArrayLoader(() => this.VeeamService.getOrderableOfferPrices(this.serviceName));
      this.orderPost = {};

      this.agreementsAccepted = false;
    }

    $onInit() {
      this.orderInfo.load()
        .then(() => {
          // Order will always return one element at the moment.  Therefore we take a shortcut.
          this.orderInfo.data = _.first(this.orderInfo.data);
        }).catch((response) => {
          this.orderInfo.data = {};
          this.$uibModalInstance.dismiss(response);
        });
    }

    confirm() {
      this.orderPost = this.CucControllerHelper.request
        .getArrayLoader({
          loaderFunction: () => this.VeeamService
            .updateOffer(this.serviceName, this.orderInfo.data.offer, this.orderInfo.data.duration),
          successHandler: response => this.$uibModalInstance.close(response),
          errorHandler: response => this.$uibModalInstance.dismiss(response),
        });
      this.orderPost.load();
    }

    cancel() {
      this.$uibModalInstance.dismiss();
    }

    onAcceptAgreements(value) {
      this.agreementsAccepted = value;
    }

    isModalLoading() {
      return _.get(this.orderInfo, 'loading', false) || _.get(this.orderPost, 'loading', false);
    }
  }

  angular.module('managerApp').controller('VeeamUpdateOfferCtrl', VeeamUpdateOfferCtrl);
})();
