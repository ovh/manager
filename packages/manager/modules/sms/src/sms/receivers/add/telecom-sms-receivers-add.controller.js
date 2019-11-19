import angular from 'angular';
import endsWith from 'lodash/endsWith';
import get from 'lodash/get';
import head from 'lodash/head';
import isArray from 'lodash/isArray';
import last from 'lodash/last';
import some from 'lodash/some';

export default class {
  /* @ngInject */
  constructor(
    $q, $stateParams, $timeout, $translate, $uibModalInstance,
    OvhApiSms, OvhApiMe, slot, TucToastError,
  ) {
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.$uibModalInstance = $uibModalInstance;
    this.api = {
      sms: {
        receivers: OvhApiSms.Receivers().v6(),
      },
      user: {
        document: OvhApiMe.Document().v6(),
      },
    };
    this.slot = slot;
    this.TucToastError = TucToastError;
  }

  $onInit() {
    this.loading = {
      addReceiver: false,
    };
    this.added = false;
    this.receiverForm = {
      description: null,
      url: null,
      uploadedFile: null,
      autoUpdate: false,
    };
    this.urlMode = false;
    this.requirement = false;
    this.lineErrors = null;
  }

  /**
   * Add receiver list.
   * @return {Promise}
   */
  add() {
    this.loading.addReceiver = true;
    this.requirement = false;
    return this.$q.all([
      this.createReceiversList(),
      this.$timeout(angular.noop, 1000),
    ]).then(() => {
      this.loading.addReceiver = false;
      if (!this.requirement && !this.lineErrors) {
        this.added = true;
        return this.$timeout(() => this.close(), 1000);
      }
      return null;
    }).catch(error => this.cancel({
      type: 'API',
      msg: error,
    }));
  }

  /**
   * Create receivers' list.
   * @return {Promise}
   */
  createReceiversList() {
    let promise = null;
    this.lineErrors = null;
    if (this.urlMode) {
      promise = this.api.sms.receivers.create({
        serviceName: this.$stateParams.serviceName,
      }, {
        autoUpdate: this.receiverForm.autoUpdate,
        csvUrl: this.receiverForm.url,
        description: this.receiverForm.description,
        slotId: head(this.slot.available),
      }).$promise;
    } else {
      promise = this.api.user.document.upload(
        this.receiverForm.uploadedFile.name,
        this.receiverForm.uploadedFile,
      ).then(doc => this.api.sms.receivers.create({
        serviceName: this.$stateParams.serviceName,
      }, {
        autoUpdate: this.receiverForm.autoUpdate,
        documentId: doc.id,
        description: this.receiverForm.description,
        slotId: head(this.slot.available),
      }).$promise);
    }
    return promise.catch((err) => {
      const message = get(err, 'data.message');
      if (message) {
        const lineErrors = message.match(/on line (\d+)$/);
        if (isArray(lineErrors)) {
          this.lineErrors = last(lineErrors);
        }
      }
      this.loading.addReceiver = false;
      this.requirement = true;
    });
  }

  /**
   * Check valid text extention.
   * @param  {Object} file
   * @return {Boolean}
   */
  checkValidTextExtention(file) {
    const validExtensions = ['csv', 'txt'];
    const fileName = file ? file.name : '';
    const found = some(validExtensions, ext => endsWith(fileName.toLowerCase(), ext));
    if (!found) {
      this.TucToastError(this.$translate.instant('sms_receivers_add_file_invalid'));
    }
    return found;
  }

  cancel(message) {
    return this.$uibModalInstance.dismiss(message);
  }

  close() {
    return this.$uibModalInstance.close(true);
  }
}
