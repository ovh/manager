import filter from 'lodash/filter';
import isEqual from 'lodash/isEqual';
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
  ) {
    const allServicePacks = await this.ovhManagerPccServicePackService.getServicePacks(
      serviceName,
      subsidiary,
    );

    return filter(allServicePacks, (servicePack) =>
      some(servicePack.options, (option) =>
        isEqual(option.type, OPTION_TYPES.certification),
      ),
    );
  }
};

export default {
  name,
  UpgradeCertificationService,
};
