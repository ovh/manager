export default class IpLoadBalancerCipherChangeCtrl {
  /* @ngInject */
  constructor(CucControllerHelper, IpLoadBalancerCipherService) {
    this.CucControllerHelper = CucControllerHelper;

    this.IpLoadBalancerCipherService = IpLoadBalancerCipherService;

    this.cipher = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.IpLoadBalancerCipherService.getCipher(this.serviceName),
      successHandler: () => {
        this.model.cipherType.value = this.cipher.data.type;
      },
    });

    this.cipherTypes = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () =>
        this.IpLoadBalancerCipherService.getCipherTypes(this.serviceName),
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
    return this.IpLoadBalancerCipherService.updateCipher(
      this.serviceName,
      this.model.cipherType.value,
    )
      .then(() => this.goBack(true))
      .finally(() => {
        this.goBack();
        this.saving = false;
      });
  }

  isModalLoading() {
    return this.cipher.loading || this.cipherTypes.loading || this.saving;
  }
}
