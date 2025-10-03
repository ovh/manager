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
    this.initForm();
  }

  clearCondition() {
    this.condition = {};
  }

  initForm() {
    if (this.condition?.value) {
      this.isModeEdition = true;
      const { type, criterion } = this.condition;
      this.conditionType = this.conditionTypes.find(
        ({ value }) => value === type,
      );
      this.currentConditionType = type;
      this.updateCriteria(type);
      this.criterion = this.criteria.find(({ value }) => value === criterion);
    }
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
