import isEmpty from 'lodash/isEmpty';

export default class ManagerHubShortcutsCtrl {
  /* @ngInject */
  constructor($http, $translate, $q, coreConfig, coreURLBuilder) {
    this.$http = $http;
    this.$translate = $translate;
    this.$q = $q;
    this.coreConfig = coreConfig;
    this.coreURLBuilder = coreURLBuilder;
  }

  $onInit() {
    const shortcuts = [
      ...(this.coreConfig.isRegion(['EU', 'CA'])
        ? [
            {
              id: 'services',
              icon: 'oui-icon-multi-device_concept',
              url: this.coreURLBuilder.buildURL(
                'dedicated',
                '#/billing/autoRenew',
              ),
              tracking: 'hub::sidebar::shortcuts::go-to-services',
            },
          ]
        : []),
      {
        id: 'bills',
        icon: 'oui-icon-receipt_concept',
        url: this.me.enterprise
          ? 'https://billing.us.ovhcloud.com/login'
          : this.coreURLBuilder.buildURL('dedicated', '#/billing/history'),
        tracking: 'hub::sidebar::shortcuts::go-to-bills',
      },
      ...(this.coreConfig.isRegion(['EU', 'CA'])
        ? [
            {
              id: 'supportLevel',
              icon: 'oui-icon-lifebuoy_concept',
              url: this.coreURLBuilder.buildURL(
                'dedicated',
                '#/useraccount/support/level',
              ),
              tracking: 'hub::sidebar::shortcuts::go-to-support-level',
            },
          ]
        : []),
      ...(this.me.isTrusted
        ? []
        : [
            {
              id: 'products',
              icon: 'oui-icon-book-open_concept',
              tracking: 'hub::sidebar::shortcuts::go-to-catalog',
              url: this.coreURLBuilder.buildURL('hub', '#/catalog'),
            },
          ]),
      ...(this.coreConfig.isRegion(['EU', 'CA'])
        ? [
            {
              id: 'emails',
              icon: 'oui-icon-envelop-letter_concept',
              url: this.coreURLBuilder.buildURL(
                'dedicated',
                '#/useraccount/emails',
              ),
              tracking: 'hub::sidebar::shortcuts::go-to-emails',
            },
          ]
        : []),
      ...(this.coreConfig.isRegion('EU')
        ? [
            {
              id: 'contacts',
              icon: 'oui-icon-book-contact_concept',
              url: this.coreURLBuilder.buildURL(
                'dedicated',
                '#/contacts/services',
              ),
              tracking: 'hub::sidebar::shortcuts::go-to-contacts',
            },
          ]
        : []),
    ];

    return this.$translate
      .refresh()
      .then(() => {
        return shortcuts
          .filter(({ url }) => url || !isEmpty(url))
          .map((shortcut) => ({
            ...shortcut,
            label: this.$translate.instant(
              `hub_user_panel_shortcuts_link_${shortcut.id}`,
            ),
          }));
      })
      .then((result) => {
        this.shortcuts = result;
      });
  }
}
