import { ASSETS } from './constants';

export default class CarbonBalanceCompositionCtrl {
  /* @ngInject */
  constructor() {
    this.IMG_CARBON = ASSETS.IMG_CARBON;
    this.IMG_ELECTRICITY = ASSETS.IMG_ELECTRICITY;
    this.IMG_OPERATIONS = ASSETS.IMG_OPERATIONS;
    this.IMG_MANUFACTURING = ASSETS.IMG_MANUFACTURING;
  }
}
