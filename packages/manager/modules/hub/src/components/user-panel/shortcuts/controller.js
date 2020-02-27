import chunk from 'lodash/chunk';
import find from 'lodash/find';
import forEach from 'lodash/forEach';
import keys from 'lodash/keys';
import map from 'lodash/map';

export default class ManagerHubShortcutsCtrl {
  /* @ngInject */
  constructor($translate, $q, RedirectionService) {
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
        url: '#',
        tracking: 'hub::sidebar::shortcuts::go-to-catalog',
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
      .then(() => {
        return map(shortcuts, (shortcut) => ({
          ...shortcut,
          label: this.$translate.instant(
            `hub_user_panel_shortcuts_link_${shortcut.id}`,
          ),
        }));
      })
      .then((result) => {
        forEach(keys(this.notifications), (id) => {
          const toNotify = find(shortcuts, { id });
          if (toNotify) {
            toNotify.notifications = this.notifications[id];
          }
        });
        this.shortcuts = chunk(result, 3);
      });
  }
}
