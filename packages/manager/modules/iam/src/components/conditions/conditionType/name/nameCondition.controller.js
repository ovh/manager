const nameKeyTemplate = 'resource.Name';

export default class IAMConditionNameController {
  updateConditionValues() {
    const fullKey = `${nameKeyTemplate}.${this.criterion?.value}`;
    this.condition.values = {
      [fullKey]: this.nameValue,
    };
  }

  $onChanges({ criterion }) {
    if (criterion) {
      this.updateConditionValues();
    }
  }
}
