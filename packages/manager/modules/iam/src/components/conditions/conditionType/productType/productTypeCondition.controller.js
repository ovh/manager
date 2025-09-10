import { URL } from '../../../../iam.service';

const productTypeKeyTemplate = 'resource.Type';

export default class IAMConditionProductTypeController {
  /* @ngInject */
  constructor(iamResourceTypeService) {
    this.iamResourceTypeService = iamResourceTypeService;
    this.URL = URL.RESOURCE_TYPE;
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
