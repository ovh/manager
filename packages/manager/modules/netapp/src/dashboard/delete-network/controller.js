import { TERMINATE_TEXT } from './constants';

export default class OvhManagerNetAppNetworkDeleteCtrl {
  /* @ngInject */
  constructor($translate, Alerter, NetappNetworkDeleteService) {
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.NetappNetworkDeleteService = NetappNetworkDeleteService;
  }

  $onInit() {
    this.isTerminateFieldValid = false;
  }

  cancel() {
    this.trackClick('cancel');
    this.goBack();
  }

  validateField() {
    this.isTerminateFieldValid =
      this.terminateField?.toLowerCase() === TERMINATE_TEXT;
  }

  delete() {
    this.trackClick('confirm');
    this.NetappNetworkDeleteService.deleteEndpoint(
      this.storage,
      this.networkInformations,
    )
      .then(() => {
        this.trackPage('success');
        this.goBack().then(() => {
          this.Alerter.success(
            this.$translate.instant('netapp_network_delete_success_message'),
          );
        });
      })
      .catch((error) => {
        this.trackPage('error');
        this.goBack().then(() => {
          this.Alerter.error(
            this.$translate.instant('netapp_dashboard_global_error', {
              message: error?.data?.message || error.message,
              requestId: error.headers('X-Ovh-Queryid'),
            }),
          );
        });
      });
  }
}
