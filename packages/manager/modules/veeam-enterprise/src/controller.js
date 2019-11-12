export default class VeeamEnterpriseCtrl {
  /* @ngInject */
  constructor($stateParams, VeeamEnterpriseService) {
    this.serviceName = $stateParams.serviceName;
    this.VeeamEnterpriseService = VeeamEnterpriseService;
  }

  $onInit() {
    this.VeeamEnterpriseService.unitOfWork.init();
  }
}
