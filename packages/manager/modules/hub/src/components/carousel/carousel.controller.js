export default class {
  /* @ngInject */
  constructor(atInternet, $http, $q, $translate) {
    this.atInternet = atInternet;
    this.index = 0;
    this.$http = $http;
    this.$q = $q;
    this.$translate = $translate;
  }

  $onInit() {
    if (!this.items) {
      this.$http
        .get('/hub/notifications', {
          serviceType: 'aapi',
        })
        .then((data) => {
          this.items = this.filterNotifications(
            data.data.data.notifications.data,
          );
        });
    }
  }

  nextAlert() {
    if (this.index === this.items.length - 1) {
      this.index = 0;
    } else {
      this.index += 1;
    }

    this.atInternet.trackClick({
      name: `${this.trackingPrefix}::alert::action`,
      type: 'action',
    });
  }

  filterNotifications(notificationsData, productType) {
    const mappedNotifications = map(
      filter(notificationsData, (notification) => {
        return ['warning', 'error'].includes(notification.level);
      }),
      (notification) => ({
        ...notification,
        // force sanitization to null as this causes issues with UTF-8 characters
        description: this.$translate.instant(
          'manager_hub_notification_warning',
          { content: notification.description },
          undefined,
          false,
          null,
        ),
      }),
    );

    return mappedNotifications.filter(({ type }) => type === productType);
  }

  switchToAlert(index) {
    this.index = index;
  }
}
