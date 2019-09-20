export default class {
  /* @ngInject */
  constructor($uibModalInstance, OvhApiTelephony, params) {
    this.$uibModalInstance = $uibModalInstance;
    this.OvhApiTelephony = OvhApiTelephony;
    this.action = params.action;
    this.spare = params.spare;

    this.phoneIP = null;

    this.selectedDomain = '';
  }

  $onInit() {
    this.isToReplace = false;
    this.isToDelete = false;
    this.isApplyAvailable = false;

    this.loading = false;
    switch (this.action) {
      case 'replacement':
        this.isToReplace = true;
        this.title = 'phone_modal_replacement_title';
        this.loading = true;
        this.retrieveCompatibleReplacement();
        break;
      case 'delete':
        this.isToDelete = true;
        this.title = 'phone_modal_delete_title';
        this.isApplyAvailable = true;
        break;
      default:
        break;
    }
  }

  retrieveCompatibleReplacement() {
    return this.OvhApiTelephony.Spare().v6().queryCompatibleReplacement({
      spare: this.spare,
    }).$promise
      .then((result) => {
        this.isApplyAvailable = true;
        this.compatibleDomains = result;
      })
      .catch(() => {
        this.isApplyAvailable = false;
      })
      .finally(() => {
        this.loading = false;
      });
  }

  apply() {
    switch (this.action) {
      case 'replacement':
        this.replaceSpare(this.spare, this.selectedDomain, this.phoneIP);
        break;
      case 'delete':
        this.deleteSpare(this.spare);
        break;
      default:
        break;
    }
  }

  deleteSpare(spare) {
    let actionResult = null;
    return this.OvhApiTelephony.Spare().v6().deleteSpare({
      spare,
    }).$promise
      .then(() => {
        actionResult = {
          isSucceed: true,
          messageToDisplay: 'phones_modal_delete_succeed',
        };
      })
      .catch((err) => {
        actionResult = {
          isSucceed: false,
          messageToDisplay: 'phones_modal_delete_failed',
          errorMessage: err.data.message,
        };
      })
      .finally(() => this.close(actionResult));
  }

  replaceSpare(spare, domain, ip) {
    let actionResult = null;
    return this.OvhApiTelephony.Spare().v6().replaceSpare({
      spare,
    }, {
      domain,
      ip,
    }).$promise.then(() => {
      actionResult = {
        isSucceed: true,
        messageToDisplay: 'phones_modal_replacement_succeed',
      };
    })
      .catch((err) => {
        actionResult = {
          isSucceed: false,
          messageToDisplay: 'phones_modal_replacement_failed',
          errorMessage: err.data.message,
          spare,
        };
      }).finally(() => this.close(actionResult));
  }

  cancel() {
    return this.$uibModalInstance.dismiss();
  }

  close(actionResult) {
    return this.$uibModalInstance.close({ actionResult });
  }
}
