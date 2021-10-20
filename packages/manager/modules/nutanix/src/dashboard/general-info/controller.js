import { TRAVAUX_LINK } from './constants';

export default class NutanixGeneralInfoCtrl {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
    this.TRAVAUX_LINK = TRAVAUX_LINK;
  }
}
