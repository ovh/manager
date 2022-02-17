export default class PciConnectorInputController {
  $onInit() {
    this.display = this.data.name !== 'connector.class';

    // For booleans, we use an intermediate variable
    if (this.data.type === 'boolean') {
      this.tempValue = this.model[this.data.name] || 'default';
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
