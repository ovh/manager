import { UUID } from './manage-notifications.constant';
import { TRACKING_CONTEXT } from '../../cloud-connect.constants';

export default class {
  /* @ngInject */
  constructor($translate, atInternet, cloudConnectService) {
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.cloudConnectService = cloudConnectService;
    this.UUID = UUID;
  }

  $onInit() {
    this.atInternet.trackPage({
      name: TRACKING_CONTEXT.trackingPageLabel,
      type: 'navigation',
      ...TRACKING_CONTEXT,
    });
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
