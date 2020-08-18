import every from 'lodash/every';
import filter from 'lodash/filter';
import isEqual from 'lodash/isEqual';

import { OPTION_TYPES } from '../../../option/option.constants';

export const name = 'UpgradeBasicOptionsService';

export const UpgradeBasicOptionsService = class {
  /* @ngInject */
  constructor($translate, ovhManagerPccServicePackService) {
    this.$translate = $translate;
    this.ovhManagerPccServicePackService = ovhManagerPccServicePackService;
  }

  getServicePacks(serviceName,subsidiary) {
    return this.ovhManagerPccServicePackService.getServicePacks(
      serviceName,
      subsidiary,
    );
  }

  async getOrderableServicePacks(
    serviceName,
    subsidiary,
  ) {
    const allServicePacks = await this.getServicePacks(
      serviceName,
      subsidiary,
    );

    return filter(allServicePacks, (servicePack) =>
      every(servicePack.options, (option) =>
        isEqual(option.type, OPTION_TYPES.basic),
      ),
    );
  }

  getSelectionHeader() {
    return this.$translate(
      'ovhManagerPccServicePackUpgradeBasicOptions_selection_header',
    );
  }

  getSelectionSubHeader() {
    return this.$translate(
      'ovhManagerPccServicePackUpgradeBasicOptions_selection_header',
    );
  }
};

export default {
  name,
  UpgradeBasicOptionsService,
};
