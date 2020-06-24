import { PAGINATION_PER_PAGE } from './overTheBox-actions.constant';

export default class OverTheBoxActionsCtrl {
  /* @ngInject */
  constructor($translate, OvhApiOverTheBoxDevice) {
    this.$translate = $translate;
    this.OvhApiOverTheBoxDevice = OvhApiOverTheBoxDevice;
  }

  $onInit() {
    this.actionIds = [];
    this.filter = {
      perPage: PAGINATION_PER_PAGE,
    };
    this.isError = false;

    return this.getActions();
  }

  getActions() {
    this.isLoading = true;
    this.actionIds = [];
    this.isError = false;
    return this.OvhApiOverTheBoxDevice.v6()
      .getActions({ serviceName: this.serviceName })
      .$promise.then((actionIds) => {
        this.actionIds = actionIds.map((actionId) => ({ id: actionId }));
      })
      .catch((error) => {
        this.isError = true;
        this.errorMessage = `${this.$translate.instant('an_error_occured')} ${
          error.data.message
        }`;
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  transformItem(row) {
    this.isLoading = true;
    this.isError = false;
    return this.OvhApiOverTheBoxDevice.v6()
      .getAction({ serviceName: this.serviceName, actionId: row.id })
      .$promise.then((action) => action)
      .catch((error) => {
        this.isError = true;
        this.errorMessage = `${this.$translate.instant('an_error_occured')} ${
          error.data.message
        }`;
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
}
