import set from 'lodash/set';

import { VEEAM_TARIFF_DETAILS_URL } from '../../backup.constants';

export default class {
  constructor() {
    this.VEEAM_TARIFF_DETAILS_URL = VEEAM_TARIFF_DETAILS_URL;
  }

  $onInit() {
    this.data = {
      dataReplication: false,
      generalConditions: false,
    };
  }

  updateConditions(property, value) {
    set(this.data, property, value);
    this.model = this.data.dataReplication && this.data.generalConditions;
  }
}
