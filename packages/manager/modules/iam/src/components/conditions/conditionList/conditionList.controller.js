import IAMConditionsUtils from '../../../utils/conditions.utils';

export default class IAMConditionListController {
  $onInit() {
    this.condition = null;
    this.closeModal();
  }

  openModal(condition) {
    this.condition = condition;
    this.modalOpen = true;
  }

  onConfirm = (condition) => {
    const decodedCondition = IAMConditionsUtils.decodeConditionValues(
      condition.values,
      this.conditions.length + 1,
    );
    if (condition.id) {
      const existingCondition = this.conditions.find(
        ({ id }) => id === condition.id,
      );
      Object.assign(existingCondition, decodedCondition);
    } else {
      this.conditions.push(decodedCondition);
    }
    this.closeModal();
  };

  closeModal() {
    this.modalOpen = false;
  }

  removeCondition(condition) {
    this.conditions.splice(
      this.conditions.findIndex(({ id }) => id === condition.id),
      1,
    );
  }

  editCondition(condition) {
    this.openModal(condition);
  }
}
