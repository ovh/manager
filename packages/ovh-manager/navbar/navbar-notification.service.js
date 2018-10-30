import includes from 'lodash/includes';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import set from 'lodash/set';
import moment from 'moment';

export default class NavbarNotificationService {
  constructor(
    $interval,
    $q,
    $translate,
    OvhApiNotificationAapi,
    TARGET,
  ) {
    'ngInject';

    this.$interval = $interval;
    this.$q = $q;
    this.$translate = $translate;
    this.OvhApiNotificationAapi = OvhApiNotificationAapi;
    this.TARGET = TARGET;

    this.NOTIFICATION_REFRESH_TIME = 60000;
  }

  getMessages() {
    return this.$translate.refresh()
      .then(() => this.OvhApiNotificationAapi.query({
        lang: this.$translate.preferredLanguage(),
        target: this.TARGET,
      }).$promise
        .catch((error) => {
          throw error;
        }));
  }

  getSubLinks() {
    return this.getMessages()
      .then((messages) => {
        if (isArray(messages) && !isEmpty(messages)) {
          return map(messages, message => this.convertSubLink(message));
        }
        return [];
      });
  }

  static formatTime(dateTime) {
    return moment(dateTime).fromNow();
  }

  toggleSublinkAction(toUpdate, linkClicked) {
    if (toUpdate.isActive && !toUpdate.updating) {
      set(toUpdate, 'updating', true);
      this.OvhApiNotificationAapi.post({ completed: [toUpdate.id] }).$promise
        .then(() => {
          set(toUpdate, 'isActive', false);
          set(toUpdate, 'acknowledged', true);
        })
        .finally(() => { set(toUpdate, 'updating', false); });
    } else if (!toUpdate.isActive && !toUpdate.updating && !linkClicked) {
      set(toUpdate, 'updating', true);
      this.OvhApiNotificationAapi.post({ acknowledged: [toUpdate.id] }).$promise
        .then(() => {
          set(toUpdate, 'isActive', true);
          set(toUpdate, 'acknowledged', true);
        })
        .finally(() => { set(toUpdate, 'updating', false); });
    }
  }

  convertSubLink(notification) {
    set(notification, 'time', NavbarNotificationService.formatTime(notification.date));
    set(notification, 'url', notification.urlDetails.href);
    set(notification, 'isActive', includes(['acknowledged', 'delivered'], notification.status));
    set(notification, 'acknowledged', includes(['acknowledged', 'completed', 'unknown'], notification.status));
    set(notification, 'actionClicked', toUpdate => this.toggleSublinkAction(toUpdate));
    set(notification, 'linkClicked', toUpdate => this.toggleSublinkAction(toUpdate, true));

    return notification;
  }

  acknowledgeAll() {
    if (this.navbarContent && isArray(this.navbarContent.subLinks)) {
      const toAcknowledge = this.navbarContent.subLinks
        .filter(subLink => !subLink.acknowledged && subLink.isActive);

      if (toAcknowledge.length) {
        return this.OvhApiNotificationAapi.post({ acknowledged: toAcknowledge.map(x => x.id) })
          .$promise
          .then(() => {
            toAcknowledge.forEach((sublink) => {
              set(sublink, 'acknowledged', true);
            });
          });
      }
    }
    return this.$q.when(true);
  }

  setRefreshTime(sublinks) {
    if (this.formatTimeTask) {
      this.$interval.cancel(this.formatTimeTask);
    }
    this.formatTimeTask = this.$interval(() => {
      sublinks.forEach((notification) => {
        set(notification, 'time', NavbarNotificationService.formatTime(notification.date));
      });
    }, this.NOTIFICATION_REFRESH_TIME);
  }

  getNavbarContent() {
    return this.getSubLinks().then((sublinks) => {
      this.setRefreshTime(sublinks);
      const navbarContent = {
        name: 'notifications',
        title: this.$translate.instant('navbar_notification_title'),
        iconClass: 'icon-notifications',
        limitTo: 10,
        onClick: () => this.acknowledgeAll(),
        subLinks: sublinks,
        show: true,
      };
      this.acknowledgeAll();
      return navbarContent;
    });
  }
}
