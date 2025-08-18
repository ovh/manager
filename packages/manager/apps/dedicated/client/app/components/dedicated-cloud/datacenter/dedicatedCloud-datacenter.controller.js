import last from 'lodash/last';
import {
  DEDICATED_CLOUD_DATACENTER,
  COMMERCIAL_RANGE_NAME_EOL,
  VDC_MIRGRATION_GUIDE_LINK,
  TRACKING_NEW_PRODUCT_BANNER,
  TRACKING_CLICK_GO_TO_TAB_PREFIX,
  TRACKING_PAGE_GO_TO_TAB_PREFIX,
} from './dedicatedCloud-datacenter.constants';
import { VDC_TYPE } from './vmware-vdc-add/dedicatedCloud-vmware-vdc-add.constants';
import { NETWORK_LABEL } from '../../../dedicatedCloud/datacenter/dedicatedCloud-datacenter.constants';

export default class {
  /* @ngInject */
  constructor($translate, ovhManagerPccDatacenterService, coreConfig) {
    this.$translate = $translate;
    this.DEDICATED_CLOUD_DATACENTER = DEDICATED_CLOUD_DATACENTER;
    this.ovhManagerPccDatacenterService = ovhManagerPccDatacenterService;
    this.ovhSubsidiary = coreConfig.getUser().ovhSubsidiary;
    this.TRACKING_NEW_PRODUCT_BANNER = TRACKING_NEW_PRODUCT_BANNER;
    this.NETWORK_LABEL = NETWORK_LABEL;
  }

  $onInit() {
    this.ovhManagerPccDatacenterService
      .getCommercialRangeName(
        this.datacenter.model.serverName,
        this.datacenter.model.id,
      )
      .then((data) => {
        this.isEOLDatacenter = COMMERCIAL_RANGE_NAME_EOL.includes(data);
        this.datacenter.model.isNsxCommercialRangeName = data === VDC_TYPE.NSX;
        this.guideMigration =
          VDC_MIRGRATION_GUIDE_LINK[this.ovhSubsidiary] ||
          VDC_MIRGRATION_GUIDE_LINK.DEFAULT;
      });
  }

  trackTab(hit) {
    this.trackClick(
      `${TRACKING_CLICK_GO_TO_TAB_PREFIX}${hit}`,
      `${TRACKING_PAGE_GO_TO_TAB_PREFIX}${hit}`,
    );
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
