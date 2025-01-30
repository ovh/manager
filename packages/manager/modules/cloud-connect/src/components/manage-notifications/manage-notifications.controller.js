import { UUID } from './manage-notifications.constant';

export default class {
  /* @ngInject */
  constructor($translate, cloudConnectService) {
    this.$translate = $translate;
    this.cloudConnectService = cloudConnectService;
    this.UUID = UUID;
  }

  $onInit() {
    this.loading = true;
    this.disableConfirm = true;
    this.cloudConnectService
      .getCloudConnectNotifications(this.uuid)
      .then((result) => {
        this.loading = false;
        this.notifications = result;
      });
  }

  saveNotification() {
    this.loading = true;
    this.listOfActiveNotifications = this.notifications
      .filter((notification) => notification.activated)
      .map(({ type }) => type);

    return this.cloudConnectService
      .saveCloudConnectNotifications(this.uuid, this.listOfActiveNotifications)
      .then(() =>
        this.goBack(
          this.$translate.instant(
            'cloud_connect_manage_notifications_save_success',
          ),
        ),
      )
      .catch((err) =>
        this.goBack(
          this.$translate.instant(
            'cloud_connect_manage_notifications_save_error',
            {
              message: err.data.message,
              queryId: err.headers('X-Ovh-Queryid'),
            },
          ),
          'danger',
        ),
      )
      .finally(() => {
        this.loading = false;
      });
  }

  onCancel() {
    return this.goBack(false);
  }
}
