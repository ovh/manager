import { Environment } from '@ovh-ux/manager-config';
import { buildURL } from '@ovh-ux/ufrontend/url-builder';
import isEmpty from 'lodash/isEmpty';

export default class ManagerHubShortcutsCtrl {
  /* @ngInject */
  constructor($http, $translate, $q) {
    this.$http = $http;
    this.$translate = $translate;
    this.$q = $q;
  }

  $onInit() {
    const shortcuts = [
      ...(['EU', 'CA'].includes(Environment.getRegion())
        ? [
            {
              id: 'services',
              icon: 'oui-icon-multi-device_concept',
              url: buildURL('dedicated', '#/billing/autoRenew'),
              tracking: 'hub::sidebar::shortcuts::go-to-services',
            },
          ]
        : []),
      {
        id: 'bills',
        icon: 'oui-icon-receipt_concept',
        url: this.me.isEnterprise
          ? 'https://billing.us.ovhcloud.com/login'
          : buildURL('dedicated', '#/billing/history'),
        tracking: 'hub::sidebar::shortcuts::go-to-bills',
      },
      ...(['EU', 'CA'].includes(Environment.getRegion())
        ? [
            {
              id: 'supportLevel',
              icon: 'oui-icon-lifebuoy_concept',
              url: buildURL('dedicated', '#/useraccount/support/level'),
              tracking: 'hub::sidebar::shortcuts::go-to-support-level',
            },
          ]
        : []),
      {
        id: 'products',
        icon: 'oui-icon-book-open_concept',
        tracking: 'hub::sidebar::shortcuts::go-to-catalog',
        url: buildURL('hub', '#/catalog'),
      },
      ...(['EU', 'CA'].includes(Environment.getRegion())
        ? [
            {
              id: 'emails',
              icon: 'oui-icon-envelop-letter_concept',
              url: buildURL('dedicated', '#/useraccount/emails'),
              tracking: 'hub::sidebar::shortcuts::go-to-emails',
            },
          ]
        : []),
      ...(Environment.getRegion() === 'EU'
        ? [
            {
              id: 'contacts',
              icon: 'oui-icon-book-contact_concept',
              url: buildURL('dedicated', '#/contacts/services'),
              tracking: 'hub::sidebar::shortcuts::go-to-contacts',
            },
          ]
        : []),
    ];

    return this.$translate
      .refresh()
      .then(() =>
        shortcuts
          .filter(({ url }) => url || !isEmpty(url))
          .map((shortcut) => ({
            ...shortcut,
            label: this.$translate.instant(
              `hub_user_panel_shortcuts_link_${shortcut.id}`,
            ),
          })),
      )
      .then((result) => {
        this.shortcuts = result;
      });
  }
}
