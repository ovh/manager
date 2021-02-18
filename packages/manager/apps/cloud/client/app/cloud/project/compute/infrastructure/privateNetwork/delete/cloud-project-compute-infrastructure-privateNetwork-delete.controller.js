class CloudprojectcomputeinfrastructureprivatenetworkdeleteCtrl {
  constructor(
    $uibModalInstance,
    $stateParams,
    params,
    OvhApiCloudProjectNetworkPrivate,
    CloudProjectComputeInfrastructurePrivateNetworkService,
  ) {
    this.service = CloudProjectComputeInfrastructurePrivateNetworkService;
    this.serviceName = $stateParams.projectId;
    this.networkId = params;
    this.modal = $uibModalInstance;
  }

  deletePrivateNetwork() {
    this.service.deleteProjectNetworkPrivate(this.serviceName, this.networkId);
  }

  confirm() {
    this.modal.close();
    return this.deletePrivateNetwork();
  }

  cancel() {
    this.modal.dismiss();
  }
}

angular
  .module('managerApp')
  .controller(
    'CloudprojectcomputeinfrastructureprivatenetworkdeleteCtrl',
    CloudprojectcomputeinfrastructureprivatenetworkdeleteCtrl,
  );
