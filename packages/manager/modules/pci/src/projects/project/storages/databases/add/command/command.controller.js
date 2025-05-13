import {
  API_GUIDES,
  TERRAFORM_GUIDES,
  DATABASE_CREATION_GUIDES,
} from '../../../../project.constants';
import { getOrderDataFromModel, getTerraformDataFromModel } from '../add.utils';
import { ORDER_KEYS, ORDER_KEYS_TERRAFORM } from '../add.constants';

export default class CommandCtrl {
  /* @ngInject */
  constructor($translate, DatabaseService) {
    this.$translate = $translate;
    this.DatabaseService = DatabaseService;
    this.orderKeys = ORDER_KEYS;
    this.orderKeysTerraform = ORDER_KEYS_TERRAFORM;
  }

  $onInit() {
    if (!this.data) {
      this.goBack(true);
    }
    this.apiGuideUrl =
      API_GUIDES[this.user.ovhSubsidiary] || API_GUIDES.DEFAULT;
    this.terraformGuideUrl =
      TERRAFORM_GUIDES[this.user.ovhSubsidiary] || TERRAFORM_GUIDES.DEFAULT;
    this.databaseCreation = DATABASE_CREATION_GUIDES;
    this.orderAPIUrl = `POST /cloud/project/${this.projectId}/database/${this.data.engine.name}`;
    this.apiData = getOrderDataFromModel(this.data);
    this.terraformData = getTerraformDataFromModel(this.projectId, this.data);
  }

  static formatKey(key) {
    return key.replaceAll(/\./g, '_');
  }

  cancel() {
    return this.goBack();
  }
}
