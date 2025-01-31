import {
  DATACENTER_NETWORK_ONBOARDING_GUIDES,
  DATACENTER_NETWORK_ONBOARDING_MORE_CTA,
  NSXT_EDGE_PLAN_CODE,
  NSXT_EDGE_PRICING_MODE,
} from './dedicatedCloud-datacenter-network-onboarding.constants';
import NETWORK_LOGO from './assets/network.png';

export default class {
  /* @ngInject */
  constructor($translate, coreConfig, RedirectionService) {
    this.$translate = $translate;
    this.coreConfig = coreConfig;
    this.illustration = NETWORK_LOGO;
    this.expressOrderUrl = RedirectionService.getURL('expressOrder');
  }

  $onInit() {
    const user = this.coreConfig.getUser();

    this.ovhSubsidiary = user.ovhSubsidiary;

    this.ctaMore =
      DATACENTER_NETWORK_ONBOARDING_MORE_CTA[this.ovhSubsidiary] ||
      DATACENTER_NETWORK_ONBOARDING_MORE_CTA.DEFAULT;

    this.guides = DATACENTER_NETWORK_ONBOARDING_GUIDES.map((guide) => ({
      id: guide.id,
      link: guide.links[this.ovhSubsidiary] || guide.links.DEFAULT,
      title: this.$translate.instant(guide.title),
      description: this.$translate.instant(guide.description),
    }));

    this.orderLink = `${this.expressOrderUrl}?=products=${JSURL.stringify([
      {
        productId: 'privateCloud',
        serviceName: this.productId,
        planCode: NSXT_EDGE_PLAN_CODE,
        duration: '1PM',
        pricingMode: NSXT_EDGE_PRICING_MODE,
        quantity: 1,
      },
    ])}`;
  }
}
