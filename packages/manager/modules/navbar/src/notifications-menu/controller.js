import isEmpty from 'lodash/isEmpty';
import filter from 'lodash/filter';
import some from 'lodash/some';

import { Environment } from '@ovh-ux/manager-config';
import { ANIMATED_STATUS } from './constants';

export default class NotificationsCtrl {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    atInternet,
    NavbarNotifications,
    ovhManagerNavbarMenuHeaderBuilder,
    TranslateService,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.NavbarBuilder = ovhManagerNavbarMenuHeaderBuilder;
    this.NavbarNotifications = NavbarNotifications;
    this.TranslateService = TranslateService;

    this.REGION = Environment.getRegion();
  }

  $onInit() {
    this.isLoading = true;

    return this.$translate.refresh()
      .then(() => this.$q.all({
        menuTitle: this.getMenuTitle(),
        sublinks: this.getSublinks(),
      }))
      .then(({ menuTitle, sublinks }) => {
        this.NavbarNotifications.setRefreshTime(sublinks);
        this.menuTitle = menuTitle;
        this.iconIsAnimated = NotificationsCtrl.shouldAnimateIcon(sublinks);
        this.sublinks = sublinks;
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  getMenuTitle() {
    return this.NavbarBuilder.buildMenuHeader(this.$translate.instant('navbar_notification_title'));
  }

  static shouldAnimateIcon(sublinks) {
    return some(sublinks, ({ isActive, level }) => ANIMATED_STATUS.includes(level) && isActive);
  }


  getSublinks() {
    return this.NavbarNotifications.getNotifications(
      this.TranslateService.getUserLocale(),
      this.REGION,
    )
      .then((notifications) => notifications
        .map((notification) => this.NavbarNotifications.convertToSubLink(notification)))
      .catch(() => undefined);
  }

  acknowledgeAll() {
    this.atInternet.trackClick({
      name: 'notifications',
      type: 'action',
    });

    const notificationsToAcknowledge = filter(
      this.sublinks,
      ({ acknowledged, isActive }) => !acknowledged && isActive,
    );

    if (!isEmpty(notificationsToAcknowledge)) {
      return this.NavbarNotifications.updateNotifications({
        acknowledged: notificationsToAcknowledge.map(({ id }) => id),
      })
        .then(() => {
          this.sublinks = this.sublinks.map((sublink) => ({ ...sublink, acknowledged: false }));
          this.iconIsAnimated = false;
        });
    }

    return this.$q.when();
  }
}
