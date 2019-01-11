angular.module('managerApp').controller('TelecomTelephonyServiceTimeConditionImportCtrl', class TelecomTelephonyServiceTimeConditionImportCtrl {
  constructor($translate, $uibModalInstance, TucToast, voipTimeConditionConfiguration) {
    this.$translate = $translate;
    this.$uibModalInstance = $uibModalInstance;
    this.TucToast = TucToast;
    this.voipTimeConditionConfiguration = voipTimeConditionConfiguration;
  }

  $onInit() {
    this.isLoading = false;
    this.hasChecked = false;
  }

  importConfiguration() {
    this.isLoading = true;
    this.voipTimeConditionConfiguration.importConfiguration(this.uploadedFile).then((response) => {
      this.$uibModalInstance.close(response.data);
    }).catch((error) => {
      this.$uibModalInstance.dismiss(error);
    }).finally(() => { this.isLoading = false; });
  }

  cancel() {
    this.$uibModalInstance.dismiss();
  }

  checkValidFileExtention(file) {
    const jsonType = '.json';
    const fileName = file ? file.name : '';
    this.validFormatFile = _.endsWith(fileName.toLowerCase(), jsonType);
    this.hasChecked = true;

    return this.validFormatFile;
  }
});
