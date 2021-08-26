import { DATAGRID_CONFIG } from './constant';

export default class AnthosIPsCtrl {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
    this.DATAGRID_CONFIG = DATAGRID_CONFIG;
  }
}
