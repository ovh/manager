export default class PciConnectorInputController {
  $onInit() {
    this.display = this.data.name !== 'connector.class';

    // For booleans, we use an intermediate variable
    if (this.data.type === 'boolean') {
      this.tempValue = this.model[this.data.name] || 'default';
    }
    if (
      this.model[this.data.name] &&
      (this.data.type === 'int16' ||
        this.data.type === 'int32' ||
        this.data.type === 'int64')
    ) {
      this.model[this.data.name] = Number(this.model[this.data.name]);
    }
    this.options = [''].concat(this.data.values);
  }

  onRadioChange(newVal) {
    if (newVal !== 'default') {
      this.model[this.data.name] = newVal;
    } else {
      this.model[this.data.name] = undefined;
    }
  }
}
