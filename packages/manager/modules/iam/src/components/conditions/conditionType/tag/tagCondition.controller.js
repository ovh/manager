const tagKeyTemplate = 'resource.Tag({{key}})';

export default class IAMConditionTagController {
  updateConditionValues() {
    const fullKey = `${tagKeyTemplate.replace('{{key}}', this.tagKey)}.${
      this.criterion?.value
    }`;
    this.condition.values = {
      [fullKey]: this.tagValue,
    };
  }

  $onChanges({ criterion }) {
    if (criterion) {
      this.updateConditionValues();
    }
  }
}
