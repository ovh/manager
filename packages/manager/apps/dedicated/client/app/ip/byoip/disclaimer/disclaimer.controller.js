import { TRACKING_PREFIX } from '../../ip/ip-ip.constant';

export default class IpByoipConfigurationDisclaimer {
  /* @ngInject */
  constructor(atInternet, ByoipService) {
    this.atInternet = atInternet;
    this.ByoipService = ByoipService;
  }

  getPayload() {
    const keys = Object.keys(this.byoip);
    return keys.map((key) => ({ label: `${key}`, values: [this.byoip[key]] }));
  }

  submit() {
    this.atInternet.trackClick({
      name: `${TRACKING_PREFIX}::bring-your-own-ip::confirmation::confirm_${
        this.byoip.ipRir
      }_${this.byoip.campus}_${this.byoip.asRir ? 'OWN' : 'OVH'}`,
      type: 'action',
    });
    return this.ByoipService.getExpressOrder(this.getPayload()).then((val) => {
      this.goToExpressOrder(val);
    });
  }

  cancel() {
    this.atInternet.trackClick({
      name: `${TRACKING_PREFIX}::bring-your-own-ip::confirmation::cancel`,
      type: 'action',
    });
    return this.goBack();
  }
}
