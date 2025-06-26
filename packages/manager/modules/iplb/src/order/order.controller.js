// import { PREFIX_TRACKING_ORDER } from './order.constants';

export default class IpLoadBalancerOrderCtrl {
  /* @ngInject */
  constructor(coreConfig, coreURLBuilder) {
    // ipLbRoot for backlink inside the ui router
    this.ipLbRoot = coreURLBuilder.buildURL('dedicated', '#/iplb');
    this.user = coreConfig.getUser();
    this.userLocale = coreConfig.getUserLocale();
  }

  $onInit() {
    const element = document.getElementById('iplb-order-container');
    this.setupIpLb(element, {
      options: {
        assetsPath: {
          flags: 'images/flags/',
        },
        language: this.userLocale,
        subsidiary: this.user.ovhSubsidiary,
        express: {
          backUrl: this.ipLbPublicUrl,
        },
        navbar: {
          enable: true,
          backUrl: this.ipLbRoot,
        },
        cart: {
          enable: true,
        },
      },
      callbacks: {
        error: () => {},
        ready: () => {},
        update: () => {},
        navigation: () => {},
      },
    });
  }
}
