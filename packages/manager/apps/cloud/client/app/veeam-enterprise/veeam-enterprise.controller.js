class VeeamEnterpriseCtrl {
  constructor($stateParams, VeeamEnterpriseService) {
    this.serviceName = $stateParams.serviceName;
    this.VeeamEnterpriseService = VeeamEnterpriseService;
  }

  $onInit() {
    this.VeeamEnterpriseService.unitOfWork.init();
  }
}

angular.module('managerApp').controller('VeeamEnterpriseCtrl', VeeamEnterpriseCtrl);
