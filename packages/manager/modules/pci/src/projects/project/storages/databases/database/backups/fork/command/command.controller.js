import {
  API_GUIDES,
  DATABASE_CREATION_GUIDES,
} from '../../../../../../project.constants';

import { getOrderDataFromModel } from '../../../../add/add.utils';
import { ORDER_KEYS } from '../fork.constants';

export default class ForkCommandCtrl {
  /* @ngInject  */
  constructor() {
    this.orderKeys = ORDER_KEYS;
  }

  $onInit() {
    if (!this.data) {
      this.goBack();
    }
    this.apiGuideUrl =
      API_GUIDES[this.user.ovhSubsidiary] || API_GUIDES.DEFAULT;
    this.databaseCreation = DATABASE_CREATION_GUIDES;
    this.orderAPIUrl = `POST /cloud/project/${this.projectId}/database/${this.data.engine.name}`;
    this.apiData = getOrderDataFromModel(this.data);
  }

  static formatKey(key) {
    return key.replaceAll(/\./g, '_');
  }

  cancel() {
    return this.goBack();
  }
}
