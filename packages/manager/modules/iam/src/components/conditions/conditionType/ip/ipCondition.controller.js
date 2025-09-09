const ipKeyTemplate = 'request.IP';

export default class IAMConditionIPController {
  updateConditionValues() {
    const fullKey = `${ipKeyTemplate}.${this.criterion?.value}`;
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
