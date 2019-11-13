import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

export default class AddBackupStorageCtrl {
  /* @ngInject */
  constructor($translate, $uibModalInstance, CucControllerHelper, CucCloudMessage, serviceName,
    VpsService) {
    this.$translate = $translate;
    this.$uibModalInstance = $uibModalInstance;
    this.CucControllerHelper = CucControllerHelper;
    this.serviceName = serviceName;
    this.CucCloudMessage = CucCloudMessage;
    this.VpsService = VpsService;

    this.loader = {
      init: false,
      save: false,
    };
    this.available = [];
    this.model = {
      ip: null,
      ftp: false,
      cifs: false,
      nfs: false,
    };
  }

  $onInit() {
    this.loader.init = true;
    this.loadAvailableIpBlocks();
  }

  isAvailable() {
    return !isEmpty(this.available);
  }

  validateCheckboxes() {
    return this.model.ftp || this.model.cifs || this.model.nfs;
  }

  loadAvailableIpBlocks() {
    this.ipBlocks = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () => this.VpsService.getBackupStorageAuthorizableBlocks(this.serviceName)
        .then((data) => { this.available = data; })
        .catch(() => this.CucCloudMessage.error(this.$translate.instant('vps_backup_storage_access_add_ip_failure')))
        .finally(() => { this.loader.init = false; }),
    });
    return this.ipBlocks.load();
  }

  cancel() {
    this.$uibModalInstance.dismiss();
  }

  confirm() {
    if (!this.isAvailable()) {
      return this.cancel();
    }
    this.CucCloudMessage.flushChildMessage();
    this.addStorage = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () => this.VpsService
        .postBackupStorageAccess(
          this.serviceName,
          this.model.ip,
          this.model.ftp,
          this.model.nfs,
          this.model.cifs,
        )
        .then((data) => {
          if (data.state === 'ERROR') {
            this.CucCloudMessage.error(get(data, 'messages[0].message', false) || this.$translate.instant('vps_backup_storage_access_add_failure'));
          } else {
            this.CucCloudMessage.success(this.$translate.instant('vps_backup_storage_access_add_success'));
          }
        })
        .catch(err => this.CucCloudMessage.error(err || this.$translate.instant('vps_backup_storage_access_add_failure')))
        .finally(() => this.$uibModalInstance.close()),
    });
    return this.addStorage.load();
  }
}
