import groupBy from 'lodash/groupBy';
import filter from 'lodash/filter';

import { Environment } from '@ovh-ux/manager-config';
import { MAX_NOTIFICATIONS } from './constants';

export default class NotificationsCtrl {
  /* @ngInject */
  constructor(
    $document,
    $element,
    $q,
    $timeout,
    $rootScope,
    $translate,
    atInternet,
    NavbarNotifications,
    ovhManagerNavbarMenuHeaderBuilder,
    ouiNavbarConfiguration,
  ) {
    this.$document = $document;
    this.$element = $element;
    this.$q = $q;
    this.$timeout = $timeout;
    this.$rootScope = $rootScope;
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.toggle = false;
    this.NavbarBuilder = ovhManagerNavbarMenuHeaderBuilder;
    this.NavbarNotifications = NavbarNotifications;
    this.translations = ouiNavbarConfiguration.translations;

    this.REGION = Environment.getRegion();
  }

  $onInit() {
    this.isLoading = true;
    this.numberOfActiveNotifications = 0;

    // Will be bound to the click event on $document
    this.readAllNotifications = () => {
      this.toggle = false;

      // Automatically set all unread messages to read
      // when we close the notifications menu
      this.NavbarNotifications.readAllNotifications(
        this.getActiveNotifications(),
      ).then(() => {
        this.numberOfActiveNotifications = this.getActiveNotifications().length;
        this.$rootScope.$emit(
          'ovh::notifications::count',
          this.numberOfActiveNotifications,
        );
      });

      this.$document.off('click', this.readAllNotifications);
    };

    this.$rootScope.$on('ovh::notifications::toggle', () => {
      this.toggle = !this.toggle;
      if (this.toggle) {
        // Handle the click outside the notifications menu
        this.$document.on('click', this.readAllNotifications);

        this.atInternet.trackClick({
          name: 'navbar::action::notifications',
          type: 'action',
        });
      } else {
        // We unbind the click event in this function
        this.readAllNotifications();
      }
    });

    this.$rootScope.$on('ovh::notifications::hide', () => {
      this.toggle = false;

      // We unbind the click event in this function
      this.readAllNotifications();
    });

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
        this.numberOfActiveNotifications = this.getActiveNotifications().length;
        this.groupedSublinks = groupBy(this.sublinks, 'time');

        this.$rootScope.$emit(
          'ovh::notifications::count',
          this.numberOfActiveNotifications,
        );
      })
      .catch(() => {
        this.$rootScope.$emit('ovh::notifications::count', null);
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  $postLink() {
    // Avoid click propagation inside the notifications menu
    // Since we're binding a click function of the document
    this.$timeout(() => {
      this.$element.on('click', (event) => {
        event.stopPropagation();
      });
    });
  }

  $onDestroy() {
    this.$document.off('click', this.readAllNotifications);
  }

  getActiveNotifications() {
    return filter(this.sublinks, 'isActive');
  }

  toggleSublinkAction(toUpdate, linkClicked) {
    this.NavbarNotifications.toggleSublinkAction(toUpdate, linkClicked).then(
      (notification) => {
        this.numberOfActiveNotifications = this.getActiveNotifications().length;
        this.$rootScope.$emit(
          'ovh::notifications::count',
          this.numberOfActiveNotifications,
        );
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
      Environment.getUserLocale(),
      this.REGION,
    )
      .then((notifications) =>
        notifications.map((notification) =>
          this.NavbarNotifications.constructor.convertToSubLink(notification),
        ),
      )
      .catch(() => []);
  }
}
