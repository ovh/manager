export default class PciConnectorInputController {
  $onInit() {
    this.display =
      ['string', 'int64', 'int32', 'int16', 'boolean', 'list'].includes(
        this.data.type,
      ) && this.data.name !== 'connector.class';

    // For booleans, we use an intermediate variable
    if (this.data.type === 'boolean') {
      this.tempValue = 'default';
    }
  }

  onRadioChange(newVal) {
    if (newVal !== 'default') {
      this.model = newVal;
    } else {
      this.model = undefined;
    }
  }
}
