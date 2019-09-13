import capitalize from 'lodash/capitalize';
import get from 'lodash/get';

import {
  AVAILABLE_SUPPORT_LEVEL, CHATBOT_SUBSIDIARIES, HELP_CENTER_SUBSIDIARIES, ASSISTANCE_URLS,
} from './constants';

export default class {
  /* @ngInject */
  constructor(
    $q,
    $rootScope,
    $scope,
    $translate,
    atInternet,
    coreConfig,
    Navbar,
    ovhManagerNavbarMenuHeaderBuilder,
  ) {
    this.$q = $q;
    this.$rootScope = $rootScope;
    this.$scope = $scope;
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.coreConfig = coreConfig;
    this.Navbar = Navbar;
    this.NavbarBuilder = ovhManagerNavbarMenuHeaderBuilder;

    this.REGION = this.coreConfig.getRegion();
    this.URLS = ASSISTANCE_URLS[this.REGION];
  }

  $onInit() {
    this.isLoading = true;

    return this.$q.all({
      translate: this.$translate.refresh(),
      supportLevel: this.Navbar.getSupportLevel(),
    })
      .then(({ supportLevel }) => {
        if (supportLevel) {
          this.supportLevel = {
            ...supportLevel,
            displayedLevel: capitalize(supportLevel.level),
          };
          this.isSupportLevelAvailable = AVAILABLE_SUPPORT_LEVEL.includes(supportLevel.level);
        }
      })
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
    const sublinks = [];
    const useHelpCenterMenu = HELP_CENTER_SUBSIDIARIES.includes(this.subsidiary);

    if (useHelpCenterMenu) {
      sublinks.push({
        title: this.$translate.instant('navbar_assistance_help_center'),
        url: get(this.URLS, `support.${this.subsidiary}`),
        isExternal: true,
        click: () => this.atInternet.trackClick({
          name: 'assistance::all_guides',
          type: 'action',
        }),
      });
    } else {
      sublinks.push({
        title: this.$translate.instant('navbar_assistance_guide'),
        url: get(this.URLS, `guides.home.${this.subsidiary}`),
        isExternal: true,
        click: () => this.atInternet.trackClick({
          name: 'assistance::all_guides',
          type: 'action',
        }),
      });
    }

    sublinks.push(
      {
        title: this.$translate.instant('navbar_assistance_ask_for_assistance'),
        url: this.URLS.ticket,
        click: () => this.atInternet.trackClick({
          name: 'assistance::assistance_requests_created',
          type: 'action',
        }),
      },
    );

    if (!['US'].includes(this.REGION)) {
      sublinks.push({
        title: this.$translate.instant('navbar_assistance_telephony_contact'),
        url: get(this.URLS, 'support_contact', {})[this.subsidiary] || get(this.URLS, 'support_contact.FR'),
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
          this.$rootScope.$emit('ovh-chatbot:open');
        },
      });
    }

    return sublinks;
  }
}
