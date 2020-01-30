import endsWith from 'lodash/endsWith';

class CloudProjectBillingRightsAddCtrl {
  constructor(
    $stateParams,
    $uibModalInstance,
    CucControllerHelper,
    CucCloudMessage,
    model,
    OvhApiCloud,
  ) {
    this.$stateParams = $stateParams;
    this.$uibModalInstance = $uibModalInstance;
    this.CucControllerHelper = CucControllerHelper;
    this.CucCloudMessage = CucCloudMessage;
    this.model = model;
    this.OvhApiCloud = OvhApiCloud;

    this.right = {
      type: 'readOnly',
    };
  }

  validateAddRight() {
    this.CucCloudMessage.flushChildMessage();
    this.loader = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.OvhApiCloud.Project()
          .Acl()
          .v6()
          .add(
            {
              serviceName: this.$stateParams.projectId,
            },
            {
              accountId: CloudProjectBillingRightsAddCtrl.normalizedNic(
                this.right.contact,
              ),
              type: this.right.type,
            },
          )
          .$promise.then((res) => this.$uibModalInstance.close(res))
          .catch((res) => this.$uibModalInstance.dismiss(res)),
    });
    return this.loader.load();
  }

  cancel() {
    this.$uibModalInstance.dismiss();
  }

  /**
   * Returns the NIC with "-ovh" appended if it was not the case.
   */
  static normalizedNic(name) {
    // check if the NIC is not an email (it could be the case for US users)
    if (/[@.]+/.test(name)) {
      return name;
    }
    return endsWith(name, '-ovh') ? name : `${name}-ovh`;
  }
}

angular
  .module('managerApp')
  .controller(
    'CloudProjectBillingRightsAddCtrl',
    CloudProjectBillingRightsAddCtrl,
  );
