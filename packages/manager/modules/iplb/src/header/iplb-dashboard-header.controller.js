import { IPLB_GUIDES } from '../iplb.constant';

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
    const url = IPLB_GUIDES[this.user.ovhSubsidiary] || IPLB_GUIDES.DEFAULT;
    this.guides = [
      {
        name: this.$translate.instant('iplb_guides_link1'),
        url: url.link1,
        external: true,
      },
      {
        name: this.$translate.instant('iplb_guides_link2'),
        url: url.link2,
        external: true,
      },
      {
        name: this.$translate.instant('iplb_guides_link3'),
        url: url.link3,
        external: true,
      },
    ];
  }
}
