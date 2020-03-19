import groupBy from 'lodash/groupBy';
import filter from 'lodash/filter';

import { Environment } from '@ovh-ux/manager-config';
import { MAX_NOTIFICATIONS } from './constants';

export default class NotificationsCtrl {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    atInternet,
    NavbarNotifications,
    ovhManagerNavbarMenuHeaderBuilder,
    ouiNavbarConfiguration,
    TranslateService,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.NavbarBuilder = ovhManagerNavbarMenuHeaderBuilder;
    this.NavbarNotifications = NavbarNotifications;
    this.TranslateService = TranslateService;
    this.translations = ouiNavbarConfiguration.translations;

    this.REGION = Environment.getRegion();
  }

  $onInit() {
    this.isLoading = true;
    this.numberOfActiveNotifications = 0;

    return this.$translate
      .refresh()
      .then(() =>
        this.$q.all({
          menuTitle: this.getMenuTitle(),
          sublinks: this.getSublinks(),
        }),
      )
      .then(({ menuTitle, sublinks }) => {
        this.NavbarNotifications.setRefreshTime(sublinks);
        this.menuTitle = menuTitle;
        if (sublinks.length > MAX_NOTIFICATIONS) {
          this.sublinks = sublinks.slice(0, MAX_NOTIFICATIONS);
        } else {
          this.sublinks = sublinks;
        }
        this.numberOfActiveNotifications = this.getNumberOfActiveNotifications();
        this.groupedSublinks = groupBy(this.sublinks, 'time');
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  getNumberOfActiveNotifications() {
    return filter(this.sublinks, (notification) => notification.isActive)
      .length;
  }

  toggleSublinkAction(toUpdate, linkClicked) {
    this.NavbarNotifications.toggleSublinkAction(toUpdate, linkClicked).then(
      (notification) => {
        this.numberOfActiveNotifications = this.getNumberOfActiveNotifications();
        return notification;
      },
    );
  }

  getMenuTitle() {
    return this.NavbarBuilder.buildMenuHeader(
      this.$translate.instant('navbar_notification_title'),
    );
  }

  getSublinks() {
    return this.NavbarNotifications.getNotifications(
      this.TranslateService.getUserLocale(),
      this.REGION,
    )
      .then((notifications) =>
        notifications.map((notification) =>
          this.NavbarNotifications.constructor.convertToSubLink(notification),
        ),
      )
      .catch(() => undefined);
  }

  openMenu() {
    this.atInternet.trackClick({
      name: 'navbar::action::notifications',
      type: 'action',
    });
  }
}
