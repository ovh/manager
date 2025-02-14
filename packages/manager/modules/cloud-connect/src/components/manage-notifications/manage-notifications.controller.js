import { UUID } from './manage-notifications.constant';
import {
  TRACKING_CONTEXT,
  TRACKING_PREFIX,
} from '../../cloud-connect.constants';

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
      name: `${TRACKING_PREFIX}::cloud-connect::pop-up::edit::notifications::settings`,
      type: 'navigation',
      ...TRACKING_CONTEXT,
      page_category: 'pop-up',
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
    this.selectedOptions =
      this.listOfActiveNotifications.length === 0
        ? 'none'
        : this.listOfActiveNotifications.join('::option-');
    this.atInternet.trackClick({
      name: `${TRACKING_PREFIX}::pop-up::button::edit_notification-settings::accept-option-${this.selectedOptions}`,
      type: 'action',
      ...TRACKING_CONTEXT,
      page: {
        name: `${TRACKING_PREFIX}::cloud-connect::pop-up::edit::notifications::settings`,
      },
      page_category: 'pop-up',
    });
    return this.cloudConnectService
      .saveCloudConnectNotifications(this.uuid, this.listOfActiveNotifications)
      .then(() =>
        this.goBack(
          this.$translate.instant(
            'cloud_connect_manage_notifications_save_success',
          ),
          'success',
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
          'error',
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
