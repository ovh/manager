import first from 'lodash/first';
import filter from 'lodash/filter';
import findIndex from 'lodash/findIndex';
import map from 'lodash/map';
import set from 'lodash/set';

export default class {
  /* @ngInject */
  constructor($window, coreConfig, OvhApiNotificationAapi, TranslateService) {
    this.$window = $window;
    this.OvhApiNotificationAapi = OvhApiNotificationAapi;
    this.TranslateService = TranslateService;
    this.REGION = coreConfig.getRegion();
  }

  $onInit() {
    return this.OvhApiNotificationAapi.query(
      this.TranslateService.getUserLocale(),
      this.REGION,
    ).$promise.then((notificationList) => {
      this.notifications = map(
        filter(
          notificationList,
          (notification) =>
            notification.level === 'warning' || notification.level === 'error',
        ),
        (notification) => ({
          ...notification,
          active: false,
        }),
      );
      set(first(this.notifications), 'active', true);
    });
  }

  nextAlert() {
    this.activeIndex = findIndex(this.notifications, { active: true });
    set(this.notifications[this.activeIndex], 'active', false);
    if (this.activeIndex < this.notifications.length - 1) {
      this.index = this.activeIndex + 1;
    } else {
      this.index = 0;
    }
    set(this.notifications[this.index], 'active', true);
  }

  notificationClick(notification) {
    this.$window.location.href = notification.urlDetails.href;
  }
}
