export default class IpLoadBalancerCipherChangeCtrl {
  /* @ngInject */
  constructor($uibModalInstance, serviceName, CucControllerHelper, IpLoadBalancerCipherService) {
    this.$uibModalInstance = $uibModalInstance;

    this.serviceName = serviceName;
    this.CucControllerHelper = CucControllerHelper;

    this.IpLoadBalancerCipherService = IpLoadBalancerCipherService;

    this.cipher = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () => this.IpLoadBalancerCipherService.getCipher(this.serviceName),
      successHandler: () => { this.model.cipherType.value = this.cipher.data.type; },
    });

    this.cipherTypes = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () => this.IpLoadBalancerCipherService.getCipherTypes(this.serviceName),
    });

    this.model = {
      cipherType: {
        value: '',
      },
    };
  }

  $onInit() {
    this.cipher.load();
    this.cipherTypes.load();
  }

  confirm() {
    this.saving = true;
    return this.IpLoadBalancerCipherService
      .updateCipher(this.serviceName, this.model.cipherType.value)
      .then(response => this.$uibModalInstance.close(response))
      .catch(response => this.$uibModalInstance.dismiss(response))
      .finally(() => {
        this.saving = false;
      });
  }

  cancel() {
    this.$uibModalInstance.dismiss();
  }

  isModalLoading() {
    return this.cipher.loading || this.cipherTypes.loading || this.saving;
  }
}
