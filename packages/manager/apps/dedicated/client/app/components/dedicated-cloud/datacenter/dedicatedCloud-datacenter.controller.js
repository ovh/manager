import last from 'lodash/last';
import {
  DEDICATED_CLOUD_DATACENTER,
  COMMERCIAL_RANGE_NAME_EOL,
  VDC_MIRGRATION_GUIDE_LINK,
  TRACKING_NEW_PRODUCT_BANNER,
  TRACKING_PREFIX,
} from './dedicatedCloud-datacenter.constants';

export default class {
  /* @ngInject */
  constructor($translate, ovhManagerPccDatacenterService, coreConfig) {
    this.$translate = $translate;
    this.DEDICATED_CLOUD_DATACENTER = DEDICATED_CLOUD_DATACENTER;
    this.ovhManagerPccDatacenterService = ovhManagerPccDatacenterService;
    this.ovhSubsidiary = coreConfig.getUser().ovhSubsidiary;
    this.TRACKING_NEW_PRODUCT_BANNER = TRACKING_NEW_PRODUCT_BANNER;
    this.TRACKING_PREFIX = TRACKING_PREFIX;
  }

  $onInit() {
    this.ovhManagerPccDatacenterService
      .getCommercialRangeName(
        this.datacenter.model.serverName,
        this.datacenter.model.id,
      )
      .then((data) => {
        this.isEOLDatacenter = COMMERCIAL_RANGE_NAME_EOL.includes(data);
        this.guideMigration =
          VDC_MIRGRATION_GUIDE_LINK[this.ovhSubsidiary] ||
          VDC_MIRGRATION_GUIDE_LINK.DEFAULT;
      });
  }

  /* Update description or name */
  editDescription(value, contextTitle) {
    const context = last(contextTitle.split('_'));
    const successText = this.$translate.instant(
      `dedicatedCloud_datacenter_${context}Modifying_success`,
    );
    const destinationId = this.DEDICATED_CLOUD_DATACENTER.alertId;
    this.editDetails({
      contextTitle,
      successText,
      datacenterId: this.datacenter.model.id,
      destinationId,
      value,
    }).result.then((newValue) => {
      if (contextTitle === 'dedicatedCloud_datacenter_name') {
        this.datacenter.model.name = newValue;
      } else {
        this.datacenter.model.description = newValue;
      }
    });
  }
}
