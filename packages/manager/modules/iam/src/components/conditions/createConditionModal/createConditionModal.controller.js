import {
  CONDITION_TYPE_CRITERIA,
  CONDITION_TYPES,
} from '../conditionType/conditionType.constants';

export default class IAMCreateConditionModalController {
  /* @ngInject */
  constructor($translate, iamConditionOperatorService) {
    this.$translate = $translate;
    this.iamConditionOperatorService = iamConditionOperatorService;
  }

  $onInit() {
    this.initConditionTypes();
    this.clearCondition();
  }

  clearCondition() {
    this.condition = {};
  }

  updateCriteria(type) {
    this.criteria = this.iamConditionOperatorService.createCriteriaList(
      CONDITION_TYPE_CRITERIA[type],
    );
  }

  onChangeConditionType({ value }) {
    this.currentConditionType = value;
    this.clearCondition();
    this.updateCriteria(value);
    this.criterion = null;
  }

  addCondition() {
    this.onConfirm(this.condition);
  }

  initConditionTypes() {
    this.conditionTypes = Object.values(CONDITION_TYPES).map((type) => ({
      label: this.$translate.instant(`iam_create_condition_type_${type}`),
      value: type,
    }));
  }
}
