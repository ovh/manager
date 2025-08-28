import {
  DATACENTER_NETWORK_ONBOARDING_GUIDES,
  NSXT_EDGE_PLAN_CODE,
} from './dedicatedCloud-datacenter-network-onboarding.constants';
import {
  NETWORK_LABEL,
  DATACENTER_NETWORK_SITE_WEB_LINK,
} from '../../../../../dedicatedCloud/datacenter/dedicatedCloud-datacenter.constants';
import NETWORK_LOGO from './assets/network.png';

export default class {
  /* @ngInject */
  constructor($translate, coreConfig, RedirectionService, DedicatedCloud) {
    this.$translate = $translate;
    this.coreConfig = coreConfig;
    this.illustration = NETWORK_LOGO;
    this.expressOrderUrl = RedirectionService.getURL('expressOrder');
    this.NETWORK_LABEL = NETWORK_LABEL;
    this.DedicatedCloud = DedicatedCloud;
  }

  $onInit() {
    const user = this.coreConfig.getUser();

    this.ovhSubsidiary = user.ovhSubsidiary;

    this.ctaMore =
      DATACENTER_NETWORK_SITE_WEB_LINK[this.ovhSubsidiary] ||
      DATACENTER_NETWORK_SITE_WEB_LINK.GB;

    this.guides = DATACENTER_NETWORK_ONBOARDING_GUIDES.map((guide) => ({
      id: guide.id,
      link: guide.links[this.ovhSubsidiary] || guide.links.DEFAULT,
      title: this.$translate.instant(guide.title),
      description: this.$translate.instant(guide.description),
      category: this.$translate.instant(guide.category),
    }));

    this.loadPricingModeData();
  }

  loadPricingModeData() {
    this.isLoading = true;
    this.error = false;

    return this.DedicatedCloud.getVCDPricingMode(this.productId)
      .then((pricingMode) => {
        this.pricingMode = pricingMode;
        this.orderLink = this.generateOrderLink();
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  generateOrderLink() {
    return `${this.expressOrderUrl}?products=${JSURL.stringify([
      {
        productId: 'privateCloud',
        serviceName: this.productId,
        planCode: NSXT_EDGE_PLAN_CODE,
        duration: 'P1M',
        pricingMode: this.pricingMode,
        quantity: 1,
        configuration: [
          {
            label: 'datacenter_id',
            value: this.datacenterId,
          },
        ],
      },
    ])}`;
  }

  handleOrderClick() {
    this.displaySuccessMessage(
      this.$translate.instant(
        'dedicatedCloud_datacenter_network_onboarding_order_success',
        { link: this.orderLink },
      ),
    );
  }
}
