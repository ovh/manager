export default class VeeamEnterpriseCtrl {
  /* @ngInject */
  constructor($stateParams, VeeamEnterpriseService, constants) {
    this.serviceName = $stateParams.serviceName;
    this.VeeamEnterpriseService = VeeamEnterpriseService;
    this.constants = constants;
  }

  $onInit() {
    this.VeeamEnterpriseService.unitOfWork.init();
  }
}
