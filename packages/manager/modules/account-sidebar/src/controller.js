export default class OvhManagerAccountSidebarCtrl {
  /* @ngInject */
  constructor(
    $q,
    $rootScope,
    $translate,
    atInternet,
    coreConfig,
    coreURLBuilder,
    RedirectionService,
  ) {
    this.$q = $q;
    this.$rootScope = $rootScope;
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.coreConfig = coreConfig;
    this.coreURLBuilder = coreURLBuilder;
    this.RedirectionService = RedirectionService;

    this.$rootScope.$on('ovh::sidebar::toggle', () => {
      this.isSidebarVisible = !this.isSidebarVisible;
    });

    this.$rootScope.$on('ovh::sidebar::hide', () => {
      this.isSidebarVisible = false;
      this.sidebarExpand = false;
    });

    const unregisterListener = this.$rootScope.$on('ovh-chatbot:enable', () => {
      this.hasChatbot = true;
      this.links = this.getLinks();
      unregisterListener();
    });
  }

  $onInit() {
    if (!this.me) {
      this.me = this.coreConfig.getUser();
    }

    this.isSidebarVisible = this.expand;
    this.hasChatbot = false;
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
        href: this.coreURLBuilder.buildURL('dedicated', '#/ticket'),
        tracking: `${trackingPrefix}::go-to-tickets`,
        icon: 'oui-icon oui-icon-envelop_concept',
        label: this.$translate.instant('hub_links_tickets'),
      },
      ...(this.coreConfig.isRegion(['EU', 'CA'])
        ? [
            {
              href: this.coreURLBuilder.buildURL(
                'dedicated',
                '#/support/tickets/new',
              ),
              tracking: `${trackingPrefix}::go-to-create-ticket`,
              icon: 'oui-icon oui-icon-user-support_concept',
              label: this.$translate.instant('hub_links_create_ticket'),
            },
          ]
        : []),
    ];
  }
}
