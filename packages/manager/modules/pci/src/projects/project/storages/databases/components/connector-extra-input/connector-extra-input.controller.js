export default class PciConnectorExtraInputController {
  $onInit() {
    this.extraConfig = this.getExtraConfigFromModel();
  }

  getExtraConfigFromModel() {
    const extraConfig = [];
    Object.keys(this.model).forEach((field) => {
      if (![null, undefined, ''].includes(this.model[field])) {
        if (this.configuration.isExtra(field)) {
          extraConfig.push({
            key: field,
            value: this.model[field],
            added: true,
          });
        }
      }
    });
    // Add an empty value for the inline adder
    extraConfig.push({});
    return extraConfig;
  }

  onAddExtra($index) {
    this.model[this.extraConfig[$index].key] = this.extraConfig[$index].value;
    this.extraConfig[$index].added = true;
    this.extraConfig.push({});
  }

  onRemoveExtra($index) {
    this.model[this.extraConfig[$index].key] = null;
    this.extraConfig.splice($index, 1);
  }
}
