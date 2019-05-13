import filter from 'lodash/filter';
import get from 'lodash/get';
import has from 'lodash/has';
import isFunction from 'lodash/isFunction';

import { Environment } from '@ovh-ux/manager-config';
import { CHATBOT_SUBSIDIARIES, HELP_CENTER_SUBSIDIARIES, URLS } from './constants';

export default class {
  /* @ngInject */
  constructor(
    $q,
    $scope,
    $translate,
    atInternet,
    OtrsPopupService,
    ovhManagerNavbarMenuHeaderBuilder,
  ) {
    this.$q = $q;
    this.$scope = $scope;
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.otrsPopupService = OtrsPopupService;
    this.NavbarBuilder = ovhManagerNavbarMenuHeaderBuilder;

    this.REGION = Environment.getRegion();
  }

  $onInit() {
    this.isLoading = true;

    return this.$translate.refresh()
      .then(() => this.getMenuTitle())
      .then((menuTitle) => {
        this.menuTitle = menuTitle;
        this.sublinks = this.getSublinks();
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  getMenuTitle() {
    return this.NavbarBuilder.buildMenuHeader(this.$translate.instant('navbar_assistance'));
  }

  trackUserMenuSection(name, chapter2) {
    this.atInternet.trackClick({
      name,
      type: 'action',
      chapter1: 'account',
      chapter2,
    });
  }

  getSublinks() {
    let sublinks = [];
    const useHelpCenterMenu = HELP_CENTER_SUBSIDIARIES.includes(this.subsidiary);

    if (useHelpCenterMenu) {
      sublinks.push({
        title: this.$translate.instant('navbar_assistance_help_center'),
        url: get(URLS, `support.${this.subsidiary}`),
        isExternal: true,
        click: () => this.atInternet.trackClick({
          name: 'assistance::all_guides',
          type: 'action',
        }),
        mustBeKept: has(URLS, `support.${this.subsidiary}`),
      },
      {
        title: this.$translate.instant('navbar_assistance_ask_for_assistance'),
        url: URLS.ticket,
        click: () => this.atInternet.trackClick({
          name: 'assistance::assistance_requests_created',
          type: 'action',
        }),
        mustBeKept: has(URLS, 'ticket'),
      });
    } else {
      sublinks.push({
        title: this.$translate.instant('navbar_assistance_guide'),
        url: get(URLS, `guides.${this.universe}.${this.subsidiary}`),
        isExternal: true,
        click: () => this.atInternet.trackClick({
          name: `assistance::all_guides::${this.universe}`,
          type: 'action',
        }),
        mustBeKept: has(URLS, `guides.${this.universe}.${this.subsidiary}`),
      },
      {
        title: this.$translate.instant('navbar_assistance_all_guides'),
        url: get(URLS, `guides.home.${this.subsidiary}`),
        isExternal: true,
        click: () => this.atInternet.trackClick({
          name: 'assistance::all_guides',
          type: 'action',
        }),
        mustBeKept: !has(URLS, `guides.${this.universe}.${this.subsidiary}`) && has(URLS, `guides.home.${this.subsidiary}`),
      }, {
        title: this.$translate.instant('navbar_assistance_new_ticket'),
        click: (callback) => {
          if (!this.otrsPopupService.isLoaded()) {
            this.otrsPopupService.init();
          } else {
            this.otrsPopupService.toggle();
          }

          this.atInternet.trackClick({
            name: 'assistance::create_assistance_request',
            type: 'action',
          });

          if (isFunction(callback)) {
            callback();
          }
        },
        mustBeKept: true,
      },
      {
        title: this.$translate.instant('navbar_assistance_list_ticket'),
        url: URLS.ticket,
        click: () => this.atInternet.trackClick({
          name: 'assistance::assistance_requests_created',
          type: 'action',
        }),
        mustBeKept: has(URLS, 'ticket'),
      });
    }

    sublinks = filter(sublinks, 'mustBeKept');

    if (!['US'].includes(this.REGION)) {
      sublinks.push({
        title: this.$translate.instant('navbar_assistance_telephony_contact'),
        url: get(URLS, 'support_contact', {})[this.subsidiary] || get(URLS, 'support_contact.FR'),
        isExternal: true,
        click: () => this.atInternet.trackClick({
          name: 'assistance::helpline',
          type: 'action',
        }),
      });
    }

    if (CHATBOT_SUBSIDIARIES.includes(this.subsidiary)) {
      sublinks.push({
        title: `${this.$translate.instant('navbar_assistance_chatbot')} <sup class="oui-color-california">OVH Chat</sup>`,
        click: () => {
          this.atInternet.trackClick({
            name: 'assistance::chatbot',
            type: 'action',
          });
          this.$scope.$emit('ovh-chatbot:open');
        },
      });
    }

    return sublinks;
  }
}
