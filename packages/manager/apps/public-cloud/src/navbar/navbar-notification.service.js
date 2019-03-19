import _ from 'lodash';
import moment from 'moment';

export default class NavbarNotificationService {
  /* @ngInject */

  constructor(
    $interval,
    $q,
    $translate,
    OvhApiNotificationAapi,
    TARGET,
  ) {
    this.$interval = $interval;
    this.$q = $q;
    this.$translate = $translate;
    this.OvhApiNotificationAapi = OvhApiNotificationAapi;
    this.TARGET = TARGET;

    this.NOTIFICATION_REFRESH_TIME = 60000;
  }

  getMessages() {
    return this
      .$translate
      .refresh()
      .then(() => this.OvhApiNotificationAapi.query({
        lang: this.$translate.preferredLanguage(),
        target: this.TARGET,
      }).$promise);
  }

  getSubLinks() {
    return this.getMessages()
      .then((messages) => {
        if (_.isArray(messages) && !_.isEmpty(messages)) {
          return _.map(messages, message => this.convertSubLink(message));
        }
        return [];
      });
  }

  static formatTime(dateTime) {
    return moment(dateTime).fromNow();
  }

  toggleSublinkAction(toUpdate, linkClicked) {
    if (toUpdate.isActive && !toUpdate.updating) {
      _.set(toUpdate, 'updating', true);
      this.OvhApiNotificationAapi.post({ completed: [toUpdate.id] }).$promise
        .then(() => {
          _.set(toUpdate, 'isActive', false);
          _.set(toUpdate, 'acknowledged', true);
        })
        .finally(() => { _.set(toUpdate, 'updating', false); });
    } else if (!toUpdate.isActive && !toUpdate.updating && !linkClicked) {
      _.set(toUpdate, 'updating', true);
      this.OvhApiNotificationAapi.post({ acknowledged: [toUpdate.id] }).$promise
        .then(() => {
          _.set(toUpdate, 'isActive', true);
          _.set(toUpdate, 'acknowledged', true);
        })
        .finally(() => { _.set(toUpdate, 'updating', false); });
    }
  }

  convertSubLink(notification) {
    _.set(notification, 'time', NavbarNotificationService.formatTime(notification.date));
    _.set(notification, 'url', notification.urlDetails.href);
    _.set(notification, 'isActive', _.includes(['acknowledged', 'delivered'], notification.status));
    _.set(notification, 'acknowledged', _.includes(['acknowledged', 'completed', 'unknown'], notification.status));
    _.set(notification, 'actionClicked', toUpdate => this.toggleSublinkAction(toUpdate));
    _.set(notification, 'linkClicked', toUpdate => this.toggleSublinkAction(toUpdate, true));

    return notification;
  }

  acknowledgeAll() {
    if (this.navbarContent && _.isArray(this.navbarContent.subLinks)) {
      const toAcknowledge = this.navbarContent.subLinks
        .filter(subLink => !subLink.acknowledged && subLink.isActive);

      if (toAcknowledge.length) {
        return this.OvhApiNotificationAapi.post({ acknowledged: toAcknowledge.map(x => x.id) })
          .$promise
          .then(() => {
            toAcknowledge.forEach((sublink) => {
              _.set(sublink, 'acknowledged', true);
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
        _.set(notification, 'time', NavbarNotificationService.formatTime(notification.date));
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
