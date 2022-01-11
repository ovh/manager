import groupBy from 'lodash/groupBy';
import filter from 'lodash/filter';

import { MAX_NOTIFICATIONS } from './constants';

export default class NotificationsCtrl {
  /* @ngInject */
  constructor(
    $document,
    $element,
    $timeout,
    $rootScope,
    $translate,
    atInternet,
    coreConfig,
    NavbarNotifications,
    ouiNavbarConfiguration,
  ) {
    this.$document = $document;
    this.$element = $element;
    this.$timeout = $timeout;
    this.$rootScope = $rootScope;
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.coreConfig = coreConfig;
    this.isOpen = false;
    this.NavbarNotifications = NavbarNotifications;
    this.translations = ouiNavbarConfiguration.translations;
    this.$translate.refresh().then(() => {
      this.translations = ouiNavbarConfiguration.translations;
    });
    this.REGION = this.coreConfig.getRegion();
  }

  $onInit() {
    this.isLoading = true;
    this.numberOfActiveNotifications = 0;

    // Will be bound to the click event on $document
    this.readAllNotifications = () => {
      this.isOpen = false;
      this.$rootScope.$emit('ovh::notifications::statuschange', false);

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

    const open = () => {
      this.isOpen = true;
      this.$rootScope.$emit('ovh::notifications::statuschange', true);

      this.$document.on('click', this.readAllNotifications);

      this.atInternet.trackClick({
        name: 'navbar::action::notifications',
        type: 'action',
      });
    };

    const close = () => {
      this.isOpen = false;
      this.$rootScope.$emit('ovh::notifications::statuschange', false);
      // We unbind the click event in this function
      this.readAllNotifications();
    };

    this.$rootScope.$on('ovh::notifications::toggle', () => {
      if (this.isOpen) {
        close();
      } else {
        open();
      }
    });

    this.$rootScope.$on('ovh::notifications::open', () => {
      open();
    });

    this.$rootScope.$on('ovh::notifications::hide', () => {
      close();
    });

    return this.$translate
      .refresh()
      .then(() => this.getSublinks())
      .then((sublinks) => {
        this.NavbarNotifications.setRefreshTime(sublinks);
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

  getSublinks() {
    return this.NavbarNotifications.getNotifications(
      this.coreConfig.getUserLocale(),
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
