import { URL } from '../../../../iam.service';
import { CONDITION_TYPES } from '../conditionType.constants';

const productTypeKeyTemplate = `resource.${CONDITION_TYPES.PRODUCT_TYPE}`;

export default class IAMConditionProductTypeController {
  /* @ngInject */
  constructor(iamResourceTypeService) {
    this.iamResourceTypeService = iamResourceTypeService;
    this.URL = URL.RESOURCE_TYPE;
  }

  $onInit() {
    this.initForm();
  }

  initForm() {
    this.productTypes = this.condition?.value?.split(',');
  }

  updateConditionValues() {
    const fullKey = `${productTypeKeyTemplate}.${this.criterion?.value}`;
    this.condition.values = {
      [fullKey]: this.productTypes.map(({ value }) => value).join(','),
    };
  }

  $onChanges({ criterion }) {
    if (criterion && this.productTypes) {
      this.updateConditionValues();
    }
  }

  transformResourceTypes(resourceTypes) {
    this.iamResourceTypeService.transformResourceTypes(resourceTypes);
  }
}
