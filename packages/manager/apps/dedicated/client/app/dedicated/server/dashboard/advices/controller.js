import {
  BARE_METAL_ADVANCED_WITHOUT_GUARANTEED_BW_TAG,
  OVERUSE_OF_BURST_CAPACITY_TAG,
} from './constants';

export default class DedicatedServerAdvicesCtrl {
  /* @ngInject */
  constructor($translate, OvhHttp) {
    this.$translate = $translate;
    this.OvhHttp = OvhHttp;
  }

  $onInit() {
    this.loading = true;
    this.advices = this.loadAdvices().finally(() => {
      this.loading = false;
    });
  }

  loadAdvices() {
    return this.OvhHttp.get('/advices/dedicated-server/{serviceName}', {
      rootPath: '2api',
      urlParams: {
        serviceName: this.server.name,
      },
    }).then((res) => this.transformAdvices(res.data.advices));
  }

  transformAdvices(advices) {
    return advices.map((advice) =>
      this.getAdvice(advice.name === 'BURST_CAPACITY'),
    );
  }

  getAdvice(burstCapacity) {
    this.isBustCapacityLimitReached = true;
    const advice = {
      href: this.publicBandwidthOrderLink,
      localizedName: this.$translate.instant(
        'server_advices_action_activate_bandwidth',
      ),
    };
    if (burstCapacity) {
      advice.tag = OVERUSE_OF_BURST_CAPACITY_TAG;
    } else {
      advice.tag = BARE_METAL_ADVANCED_WITHOUT_GUARANTEED_BW_TAG;
    }
    return advice;
  }
}
