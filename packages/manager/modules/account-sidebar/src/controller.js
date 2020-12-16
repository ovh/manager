import { Environment } from '@ovh-ux/manager-config';
import { buildURL } from '@ovh-ux/ufrontend/url-builder';
import constants from './constants';

export default class OvhManagerAccountSidebarCtrl {
  /* @ngInject */
  constructor($q, $rootScope, $translate, atInternet, RedirectionService) {
    this.$q = $q;
    this.$rootScope = $rootScope;
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.RedirectionService = RedirectionService;

    this.$rootScope.$on('ovh::sidebar::toggle', () => {
      this.isSidebarVisible = !this.isSidebarVisible;
    });

    this.$rootScope.$on('ovh::sidebar::hide', () => {
      this.isSidebarVisible = false;
      this.sidebarExpand = false;
    });
  }

  $onInit() {
    if (!this.me) {
      this.me = Environment.getUser();
    }
    this.hasChatbot = constants.CHATBOT_SUBSIDIARIES.includes(
      this.me.ovhSubsidiary,
    );
    return this.$translate
      .refresh()
      .then(() => this.getLinks())
      .then((links) => {
        this.links = links;
      });
  }

  openChatbot() {
    this.atInternet.trackClick({
      name: 'hub::sidebar::useful-links::action::chatbot',
      type: 'action',
    });
    this.$rootScope.$emit('ovh-chatbot:open');
  }

  getLinks() {
    const trackingPrefix = 'hub::sidebar::useful-links';
    return [
      {
        href: this.RedirectionService.getURL('help', {
          ovhSubsidiary: this.me.ovhSubsidiary,
        }),
        tracking: `${trackingPrefix}::go-to-helpcenter`,
        icon: 'oui-icon oui-icon-lifebuoy_concept',
        label: this.$translate.instant('hub_links_help_center'),
      },
      ...(this.hasChatbot
        ? [
            {
              action: () => {
                this.openChatbot();
              },
              icon: 'oui-icon oui-icon-speech-bubble_concept',
              label: this.$translate.instant('hub_links_chatbot'),
            },
          ]
        : []),
      {
        href: this.RedirectionService.getURL('tasks'),
        tracking: `${trackingPrefix}::go-to-ovh-status`,
        icon: 'oui-icon oui-icon-traffic-cone_concept',
        label: this.$translate.instant('hub_links_tasks'),
      },
      {
        href: buildURL('dedicated', '#/ticket'),
        tracking: `${trackingPrefix}::go-to-tickets`,
        icon: 'oui-icon oui-icon-envelop_concept',
        label: this.$translate.instant('hub_links_tickets'),
      },
      ...(['EU', 'CA'].includes(Environment.getRegion())
        ? [
            {
              href: buildURL('dedicated', '#/support/tickets/new'),
              tracking: `${trackingPrefix}::go-to-create-ticket`,
              icon: 'oui-icon oui-icon-user-support_concept',
              label: this.$translate.instant('hub_links_create_ticket'),
            },
          ]
        : []),
    ];
  }
}
