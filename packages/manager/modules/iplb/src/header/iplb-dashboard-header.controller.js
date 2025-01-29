import { GUIDE_HOME_URL } from '../dashboard/iplb-url.constants';

export default class IpLoadBalancerDashboardHeaderCtrl {
  /* @ngInject */
  constructor(
    $injector,
    $stateParams,
    $translate,
    CucControllerHelper,
    IpLoadBalancerHomeService,
    ovhDocUrl,
    constants,
  ) {
    this.$injector = $injector;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.CucControllerHelper = CucControllerHelper;
    this.IpLoadBalancerHomeService = IpLoadBalancerHomeService;
    this.ovhDocUrl = ovhDocUrl;
    this.serviceName = $stateParams.serviceName;
    this.constants = constants;

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
    this.initGuides();
  }

  initGuides() {
    this.guides = {};
    this.guides.title = this.$translate.instant('iplb_guides');
    this.guides.list = [
      {
        name: this.$translate.instant('iplb_guides_title'),
        url: this.ovhDocUrl.getDocUrl('load-balancer'),
        external: true,
      },
    ];
    this.guides.footer = {
      name: this.$translate.instant('iplb_guide_footer'),
      url: GUIDE_HOME_URL,
      external: true,
    };
  }
}
