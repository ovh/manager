import chunk from 'lodash/chunk';
import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import map from 'lodash/map';

export default class ManagerHubShortcutsCtrl {
  /* @ngInject */
  constructor($http, $translate, $q, RedirectionService) {
    this.$http = $http;
    this.$translate = $translate;
    this.$q = $q;
    this.RedirectionService = RedirectionService;
  }

  $onInit() {
    const shortcuts = [
      {
        id: 'services',
        icon: 'oui-icon-multi-device_concept',
        url: this.RedirectionService.getURL('services'),
        tracking: 'hub::sidebar::shortcuts::go-to-services',
      },
      {
        id: 'bills',
        icon: 'oui-icon-receipt_concept',
        url: this.RedirectionService.getURL('billing'),
        tracking: 'hub::sidebar::shortcuts::go-to-bills',
      },
      {
        id: 'supportLevel',
        icon: 'oui-icon-lifebuoy_concept',
        url: this.RedirectionService.getURL('supportLevel'),
        tracking: 'hub::sidebar::shortcuts::go-to-support-level',
      },
      {
        id: 'products',
        icon: 'oui-icon-book-open_concept',
        tracking: 'hub::sidebar::shortcuts::go-to-catalog',
        url: this.RedirectionService.getURL('catalog'),
      },
      {
        id: 'emails',
        icon: 'oui-icon-envelop-letter_concept',
        url: this.RedirectionService.getURL('userEmails'),
        tracking: 'hub::sidebar::shortcuts::go-to-emails',
      },
      {
        id: 'contacts',
        icon: 'oui-icon-book-contact_concept',
        url: this.RedirectionService.getURL('contacts'),
        tracking: 'hub::sidebar::shortcuts::go-to-contacts',
      },
    ];

    return this.$translate
      .refresh()
      .then(() => this.fetchBillingNotifications())
      .then((notifications) => {
        const billShortcut = find(shortcuts, { id: 'bills' });
        if (billShortcut) {
          billShortcut.notificationsCount = notifications.length;
        }
      })
      .then(() => {
        return map(shortcuts, (shortcut) => ({
          ...shortcut,
          label: this.$translate.instant(
            `hub_user_panel_shortcuts_link_${shortcut.id}`,
          ),
        }));
      })
      .then((result) => {
        this.shortcuts = chunk(result, 3);
      });
  }

  fetchBillingNotifications() {
    const notificationsPromise = this.notifications
      ? this.$q.when(this.notifications)
      : this.$http.get('/hub/notifications', {
          serviceType: 'aapi',
        });

    return notificationsPromise
      .then(({ data }) => get(data, 'data.notifications.data'))
      .then((notifications) => {
        return filter(notifications, (notification) => {
          return get(notification, 'urlDetails.relativePath', '').startsWith(
            '/billing',
          );
        });
      });
  }
}
