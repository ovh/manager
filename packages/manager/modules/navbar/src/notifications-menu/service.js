import set from 'lodash/set';

import moment from 'moment';
import { ACTIVE_STATUS, ACKNOWLEDGED_STATUS, REFRESH_TIME } from './constants';

export default class Notifications {
  /* @ngInject */
  constructor(
    $interval,
    $q,
    $translate,
    atInternet,
    OvhApiNotificationAapi,
    ovhManagerNavbarMenuHeaderBuilder,
  ) {
    this.$interval = $interval;
    this.$q = $q;
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.OvhApiNotificationAapi = OvhApiNotificationAapi;
    this.NavbarBuilder = ovhManagerNavbarMenuHeaderBuilder;
  }

  getNotifications(lang, target) {
    return this.OvhApiNotificationAapi.query({
      lang, target,
    }).$promise;
  }

  updateNotifications(status) {
    return this.OvhApiNotificationAapi.post(status).$promise;
  }

  readNotifications(notification, status) {
    set(notification, 'updating', true);

    return this.updateNotifications.post({
      [status]: notification.id,
    })
      .then(() => {
        set(notification, 'isActive', !notification.isActive);
        set(notification, 'acknowledged', true);
      })
      .finally(() => {
        set(notification, 'updating', false);
      });
  }

  toggleSublinkAction(toUpdate, linkClicked) {
    if (toUpdate.isActive && !toUpdate.updating) {
      return this.readNotifications(toUpdate, 'completed');
    }

    if (!toUpdate.isActive && !toUpdate.updating && !linkClicked) {
      return this.readNotifications(toUpdate, 'acknowledged');
    }

    return this.$q.when();
  }

  static formatTime(dateTime) {
    return moment(dateTime).fromNow();
  }

  convertToSubLink(notification) {
    return {
      ...notification,
      actionClicked: (toUpdate) => this.toggleSublinkAction(toUpdate),
      acknowledged: notification.status.includes(ACKNOWLEDGED_STATUS),
      isActive: notification.status.includes(ACTIVE_STATUS),
      linkClicked: (toUpdate) => this.toggleSublinkAction(toUpdate, true),
      time: Notifications.formatTime(notification.date),
      url: notification.urlDetails.href,
    };
  }

  setRefreshTime(sublinks) {
    if (this.formatTimeTask) {
      this.$interval.cancel(this.formatTimeTask);
    }
    this.formatTimeTask = this.$interval(() => {
      sublinks.forEach((notification) => {
        set(notification, 'time', Notifications.formatTime(notification.date));
      });
    }, REFRESH_TIME);
  }

  acknowledgeAll() {
    if (this.navbarContent) {
      const toAcknowledge = this.navbarContent.subLinks
        .filter((subLink) => !subLink.acknowledged && subLink.isActive);
      if (toAcknowledge.length) {
        this.OvhApiNotificationAapi
          .post({ acknowledged: toAcknowledge.map((x) => x.id) }).$promise
          .then(() => {
            toAcknowledge.forEach((sublink) => {
              set(sublink, 'acknowledged', true);
            });
          });
      }
      this.navbarContent.iconAnimated = false;
    }
  }
}
