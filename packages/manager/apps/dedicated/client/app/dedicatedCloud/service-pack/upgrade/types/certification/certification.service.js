import filter from 'lodash/filter';
import isEqual from 'lodash/isEqual';
import reject from 'lodash/reject';
import some from 'lodash/some';

import { OPTION_TYPES } from '../../../option/option.constants';

export const name = 'UpgradeCertificationService';

export const UpgradeCertificationService = class {
  /* @ngInject */
  constructor($translate, ovhManagerPccServicePackService) {
    this.$translate = $translate;
    this.ovhManagerPccServicePackService = ovhManagerPccServicePackService;
  }

  async getOrderableServicePacks(
    serviceName,
    subsidiary,
    currentServicePackName,
  ) {
    const allServicePacks = await this.ovhManagerPccServicePackService.getServicePacks(
      serviceName,
      subsidiary,
    );

    const allServicePacksExceptCurrent = reject(allServicePacks, {
      name: currentServicePackName,
    });

    return filter(allServicePacksExceptCurrent, (servicePack) =>
      some(servicePack.options, (option) =>
        isEqual(option.type, OPTION_TYPES.certification),
      ),
    );
  }

  getSelectionHeader() {
    return this.$translate(
      'ovhManagerPccServicePackUpgradeCertification_selection_header',
    );
  }

  getSelectionSubHeader() {
    return this.$translate(
      'ovhManagerPccServicePackUpgradeCertification_selection_header',
    );
  }
};

export default {
  name,
  UpgradeCertificationService,
};
