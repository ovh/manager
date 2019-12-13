import head from 'lodash/head';

export default class VeeamCloudConnectUpdateOfferCtrl {
  /* @ngInject */
  constructor(CucControllerHelper, VeeamCloudConnectService) {
    this.CucControllerHelper = CucControllerHelper;
    this.VeeamCloudConnectService = VeeamCloudConnectService;
    this.orderPost = {};
    this.agreementsAccepted = false;
    this.isAvailable = false;
    this.isLoading = true;
  }

  $onInit() {
    this.actions = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () => this.VeeamCloudConnectService.getActions(this.serviceName),
    });
    this.orderInfo = this.CucControllerHelper.request
      .getArrayLoader(() => this.VeeamCloudConnectService
        .getOrderableOfferPrices(this.serviceName));

    return this.orderInfo.load()
      .then(() => {
        // Order will always return one element at the moment.  Therefore we take a shortcut.
        this.orderInfo.data = head(this.orderInfo.data);
      }).catch((response) => {
        this.orderInfo.data = {};
        this.$uibModalInstance.dismiss(response);
      })
      .then(() => this.actions.load())
      .then(() => {
        if (this.actions.data.upgradeOffer.available) {
          this.isAvailable = true;
        }
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  onConfirm() {
    this.isLoading = true;
    this.orderPost = this.CucControllerHelper.request
      .getArrayLoader({
        loaderFunction: () => this.VeeamCloudConnectService
          .updateOffer(this.serviceName, this.orderInfo.data.offer, this.orderInfo.data.duration),
        successHandler: response => this.$uibModalInstance.close(response),
        errorHandler: response => this.$uibModalInstance.dismiss(response),
      });

    this.orderPost.load().then((result) => {
      this.VeeamCloudConnectService.unitOfWork.messages.push({
        textHtml: result.message,
        type: 'success',
      });
    }).catch((err) => {
      this.VeeamCloudConnectService.unitOfWork.messages.push({
        text: err.message,
        type: 'error',
      });
    }).finally(() => {
      this.isLoading = false;
      this.goToDashboard();
    });
  }

  onCancel() {
    this.goToDashboard();
  }

  onAcceptAgreements(value) {
    this.agreementsAccepted = value;
  }
}
