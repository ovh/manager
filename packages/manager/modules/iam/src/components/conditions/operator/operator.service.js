export const name = 'iamConditionOperatorService';

export default class IAMConditionOperatorService {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
  }

  createCriteriaList(criteria) {
    if (!criteria?.length) {
      return [];
    }
    return criteria.map((criterion) => ({
      label: this.$translate.instant(
        `iam_create_condition_operator_${criterion}`,
      ),
      value: criterion,
    }));
  }
}
