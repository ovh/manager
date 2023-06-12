import { CARBON_BALANCE_PICTURES } from './constants';

export default class CarbonBalanceCompositionCtrl {
  /* @ngInject */
  constructor(coreConfig) {
    this.IMG_CARBON_BALANCE =
      CARBON_BALANCE_PICTURES[coreConfig.getUser().ovhSubsidiary] ||
      CARBON_BALANCE_PICTURES.DEFAULT;
  }
}
