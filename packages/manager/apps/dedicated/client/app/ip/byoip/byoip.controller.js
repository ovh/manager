import get from 'lodash/get';
import { AS_OPTIONS, IPV4_BLOCK_PATTERN } from './byoip.constants';

export default class IpByoipConfiguration {
  /* @ngInject */
  constructor($translate, Alerter, ByoipService) {
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.ByoipService = ByoipService;

    this.AS_OPTIONS = AS_OPTIONS;
    this.IPV4_BLOCK_PATTERN = IPV4_BLOCK_PATTERN;
  }

  $onInit() {
    this.byoip = {};
    this.ipRir = get(this.plan, 'details.product.configurations', []).find(
      (config) => config.name === 'ipRir',
    ).values;
    this.regions = get(this.plan, 'details.product.configurations', []).find(
      (config) => config.name === 'campus',
    ).values;
    this.alerts = {
      list: 'ip_byoip_configuration',
    };
  }

  onRegionSelect(value) {
    return this.getToken(value)
      .then((token) => {
        this.token = token;
      })
      .catch((err) =>
        this.Alerter.error(
          `${this.$translate.instant('ip_byoip_token_fetch_error')} ${get(
            err,
            'message',
          ) || err}`,
          'ip_byoip_configuration',
        ),
      );
  }

  getPayload() {
    const keys = Object.keys(this.byoip);
    return keys.map((val) => ({ label: `${val}`, values: [this.byoip[val]] }));
  }

  orderByoip() {
    return this.ByoipService.gotToExpressOrder(
      this.plan,
      this.getPayload(),
    ).then((val) => {
      return this.goToDisclaimer(val);
    });
  }
}
