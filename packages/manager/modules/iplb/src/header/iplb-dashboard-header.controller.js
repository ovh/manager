import { GUIDE_HOME_URL, IPLB_GUIDES } from '../dashboard/iplb-url.constants';

export default class IpLoadBalancerDashboardHeaderCtrl {
  /* @ngInject */
  constructor(
    $injector,
    $stateParams,
    $translate,
    CucControllerHelper,
    IpLoadBalancerHomeService,
    constants,
    coreConfig,
  ) {
    this.$injector = $injector;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.CucControllerHelper = CucControllerHelper;
    this.IpLoadBalancerHomeService = IpLoadBalancerHomeService;
    this.serviceName = $stateParams.serviceName;
    this.constants = constants;
    this.coreConfig = coreConfig;

    //  No error handling since we don't want to break anything for a title.
    this.configuration = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.IpLoadBalancerHomeService.getConfiguration(this.serviceName),
      successHandler: () => {
        if (this.$injector.has('shellClient')) {
          const shellClient = this.$injector.get('shellClient');
          shellClient.ux.updateMenuSidebarItemLabel(
            this.serviceName,
            this.configuration.data.displayName,
          );
        }
      },
    });
  }

  $onInit() {
    this.user = this.coreConfig.getUser();
    this.initGuides();
  }

  initGuides() {
    this.guides = {};
    this.guides.title = this.$translate.instant('iplb_guides');
    const url = IPLB_GUIDES[this.user.ovhSubsidiary] || IPLB_GUIDES.DEFAULT;
    this.guides.list = [
      {
        name: this.$translate.instant('iplb_guides_title'),
        url,
        external: true,
      },
    ];
    this.guides = {
      ...this.guides,
      footer: {
        name: this.$translate.instant('iplb_guide_footer'),
        url: GUIDE_HOME_URL[this.user.ovhSubsidiary] || GUIDE_HOME_URL.DEFAULT,
        external: true,
      },
    };
  }
}
