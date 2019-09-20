export default class {
  /* @ngInject */
  constructor($uibModalInstance, OvhApiXdsl, params) {
    this.$uibModalInstance = $uibModalInstance;
    this.OvhApiXdsl = OvhApiXdsl;
    this.action = params.action;
    this.spare = params.spare;
  }

  $onInit() {
    this.isToReplace = false;
    this.isToReturn = false;
    this.isToDelete = false;
    this.isApplyAvailable = false;

    this.selectedDomain = '';

    this.loading = false;
    switch (this.action) {
      case 'replacement':
        this.isToReplace = true;
        this.title = 'xdsl_modem_modal_replacement_title';
        this.loading = true;
        this.retrieveCompatibleReplacement();
        break;
      case 'return':
        this.isToReturn = true;
        this.title = 'xdsl_modem_modal_return_title';
        this.isApplyAvailable = true;
        break;
      case 'delete':
        this.isToDelete = true;
        this.title = 'xdsl_modem_modal_delete_title';
        this.isApplyAvailable = true;
        break;
      default:
        break;
    }
  }

  retrieveCompatibleReplacement() {
    return this.OvhApiXdsl.Spare().v6().queryCompatibleReplacement({
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
        this.replaceSpare(this.spare, this.selectedDomain);
        break;
      case 'return':
        this.returnMerchandise(this.spare);
        break;
      case 'delete':
        this.deleteSpare(this.spare);
        break;
      default:
        break;
    }
  }

  returnMerchandise(spare) {
    let actionResult = null;
    return this.OvhApiXdsl.Spare().v6().returnMerchandise({
      spare,
    }, {}).$promise
      .then(() => {
        actionResult = {
          isSucceed: true,
          messageToDisplay: 'modems_modal_return_succeed',
        };
      })
      .catch((err) => {
        actionResult = {
          isSucceed: false,
          messageToDisplay: 'modems_modal_return_failed',
          errorMessage: err.data.message,
        };
      })
      .finally(() => this.close(actionResult));
  }

  deleteSpare(spare) {
    let actionResult = null;
    return this.OvhApiXdsl.Spare().v6().deleteSpare({
      spare,
    }).$promise
      .then(() => {
        actionResult = {
          isSucceed: true,
          messageToDisplay: 'modems_modal_delete_succeed',
        };
      })
      .catch((err) => {
        actionResult = {
          isSucceed: false,
          messageToDisplay: 'modems_modal_delete_failed',
          errorMessage: err.data.message,
        };
      })
      .finally(() => this.close(actionResult));
  }

  replaceSpare(spare, domain) {
    let actionResult = null;
    return this.OvhApiXdsl.Spare().v6().replaceSpare({
      spare,
    }, {
      domain,
    }).$promise.then(() => {
      actionResult = {
        isSucceed: true,
        messageToDisplay: 'modems_modal_replacement_succeed',
      };
    })
      .catch((err) => {
        actionResult = {
          isSucceed: false,
          messageToDisplay: 'modems_modal_replacement_failed',
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
