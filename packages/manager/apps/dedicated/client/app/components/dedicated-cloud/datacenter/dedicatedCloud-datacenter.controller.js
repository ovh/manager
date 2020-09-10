import last from 'lodash/last';
import { DEDICATED_CLOUD_DATACENTER } from './dedicatedCloud-datacenter.constants';

export default class {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
    this.DEDICATED_CLOUD_DATACENTER = DEDICATED_CLOUD_DATACENTER;
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
