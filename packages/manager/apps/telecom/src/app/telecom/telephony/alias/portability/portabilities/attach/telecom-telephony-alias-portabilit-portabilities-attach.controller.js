import endsWith from 'lodash/endsWith';

angular.module('managerApp').controller('TelecomTelephonyServicePortabilityMandateAttachCtrl',
  class TelecomTelephonyServicePortabilityMandateAttachCtrl {
    constructor($q, $stateParams, $timeout, $translate, $uibModalInstance, OvhApiTelephony,
      TucToast, data) {
      this.$translate = $translate;
      this.$uibModalInstance = $uibModalInstance;
      this.TucToast = TucToast;
      this.OvhApiTelephony = OvhApiTelephony;
      this.$stateParams = $stateParams;
      this.data = data;
      this.$q = $q;
      this.$timeout = $timeout;
    }

    $onInit() {
      this.isLoading = false;
      this.hasChecked = false;
    }

    attachMandate() {
      this.isLoading = true;
      return this.$q.all({
        noop: this.$timeout(angular.noop, 1000),
        upload: this.OvhApiTelephony.Portability().PortabilityDocument().v6().create({
          billingAccount: this.$stateParams.billingAccount,
          id: this.data.id,
        }, {
          name: this.uploadedFile.name,
        }),
      }).then((response) => {
        this.$uibModalInstance.close(response);
      }).catch((error) => {
        this.$uibModalInstance.dismiss(error);
      }).finally(() => { this.isLoading = false; });
    }

    cancel() {
      this.$uibModalInstance.dismiss();
    }

    checkValidFileExtention(file) {
      const pdfType = '.pdf';
      const fileName = file ? file.name : '';
      this.validFormatFile = endsWith(fileName.toLowerCase(), pdfType);
      this.hasChecked = true;

      return this.validFormatFile;
    }
  });
