import constants from './constants';

export default class OvhManagerAccountSidebarCtrl {
  /* @ngInject */
  constructor(
    $q,
    $rootScope,
    $translate,
    atInternet,
    OvhApiMe,
    RedirectionService,
  ) {
    this.$q = $q;
    this.$rootScope = $rootScope;
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.OvhApiMe = OvhApiMe;
    this.RedirectionService = RedirectionService;
  }

  $onInit() {
    return this.$q
      .when(this.me ? this.me : this.OvhApiMe.v6().get().$promise)
      .then(({ ovhSubsidiary }) => {
        this.hasChatbot = constants.CHATBOT_SUBSIDIARIES.includes(
          ovhSubsidiary,
        );
        this.links = this.getLinks();
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
    const links = [];

    links.push({
      href: this.RedirectionService.getURL('help'),
      tracking: `${trackingPrefix}::go-to-helpcenter`,
      icon: 'oui-icon oui-icon-lifebuoy_concept',
      label: this.$translate.instant('hub_links_help_center'),
    });

    if (this.hasChatbot) {
      links.push({
        action: () => {
          this.openChatbot();
        },
        icon: 'oui-icon oui-icon-lifebuoy_concept',
        label: this.$translate.instant('hub_links_chatbot'),
      });
    }

    links.push({
      href: this.RedirectionService.getURL('tasks'),
      tracking: `${trackingPrefix}::go-to-ovh-status`,
      icon: 'oui-icon oui-icon-traffic-cone_concept',
      label: this.$translate.instant('hub_links_tasks'),
    });

    links.push({
      href: this.RedirectionService.getURL('support'),
      tracking: `${trackingPrefix}::go-to-create-ticket`,
      icon: 'oui-icon oui-icon-user-support_concept',
      label: this.$translate.instant('hub_links_create_ticket'),
    });

    return links;
  }
}
