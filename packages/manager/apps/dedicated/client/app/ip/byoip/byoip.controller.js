import get from 'lodash/get';
import {
  AS_OPTIONS,
  IPV4_BLOCK_PATTERN,
  CONFIG_NAME,
  STEP_NAME,
} from './byoip.constants';
import { TRACKING_PREFIX } from '../ip/ip-ip.constant';

export default class IpByoipConfiguration {
  /* @ngInject */
  constructor($translate, Alerter, atInternet, ByoipService) {
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.atInternet = atInternet;
    this.ByoipService = ByoipService;

    this.AS_OPTIONS = AS_OPTIONS;
    this.IPV4_BLOCK_PATTERN = IPV4_BLOCK_PATTERN;
    this.STEP_NAME = STEP_NAME;
  }

  $onInit() {
    this.byoip = {};
    this.ipRir = get(this.plan, 'details.product.configurations', []).find(
      (config) => config.name === CONFIG_NAME.IPRIR,
    ).values;
    this.allRegions = get(this.plan, 'details.product.configurations', []).find(
      (config) => config.name === CONFIG_NAME.CAMPUS,
    ).values;
    this.alerts = {
      list: 'ip_byoip_configuration',
    };
  }

  submitIpRir() {
    this.trackStepSubmit(this.STEP_NAME.RIR);
    this.loadCampuses(this.byoip.ipRir);
  }

  loadCampuses(ipRir) {
    this.regions = null;
    this.loadingCampus = true;
    this.ByoipService.getIpCampuses(ipRir, this.allRegions)
      .then((regions) => {
        this.regions = regions;
      })
      .catch(() =>
        this.Alerter.error(
          this.$translate.instant('ip_byoip_campus_fetch_error'),
          'ip_byoip_configuration',
        ),
      )
      .finally(() => {
        this.loadingCampus = false;
      });
  }

  onRegionSelect(value) {
    return this.getToken(value)
      .then((token) => {
        this.token = token;
      })
      .catch((err) =>
        this.Alerter.error(
          `${this.$translate.instant('ip_byoip_token_fetch_error')} ${get(
            err.data,
            'message',
          ) || err}`,
          'ip_byoip_configuration',
        ),
      );
  }

  onAsSelect(value) {
    if (value === 'ovh_cloud') {
      this.clearAsSelection();
    }
  }

  clearAsSelection() {
    delete this.byoip.asRir;
    delete this.byoip.asNumber;
  }

  trackStepSubmit(stepType) {
    this.atInternet.trackClick({
      name: `${TRACKING_PREFIX}::bring-your-own-ip::${stepType}`,
      type: 'action',
    });
  }

  orderByoip() {
    return this.goToDisclaimer(this.byoip);
  }

  cancel() {
    this.atInternet.trackClick({
      name: `${TRACKING_PREFIX}::bring-your-own-ip::cancel`,
      type: 'action',
    });
    return this.goBack();
  }
}
