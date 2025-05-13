import remove from 'lodash/remove';

export default class BmServerComponentsInputsController {
  $onInit() {
    Object.keys(this.installation.inputs).forEach((key) => {
      const value = this.installation.inputs[key];
      if (
        value.type === 'enum' &&
        !value.mandatory &&
        value.enum.indexOf('') === -1
      ) {
        this.installation.inputs[key].enum = [''].concat(value.enum);
        // you have an optional select dropdown so you want to be able to unset to none
      }
    });

    this.installation.input = {};
    Object.values(this.installation.inputs).forEach((inputItem) => {
      let input;
      switch (inputItem.type) {
        case 'keyValue':
          input = [];
          break;
        case 'number':
          input = inputItem.default === null ? 0 : +inputItem.default;
          break;
        case 'boolean':
          input = inputItem.default !== null && inputItem.default === 'true';
          break;
        default:
          input =
            inputItem.default === null ? '' : inputItem.default?.toString();
          break;
      }

      this.installation.input[inputItem.name] = input;
    });
  }

  keyValueInit = function keyValueInit(name, mode) {
    if (this.installation.input[name].length !== 0) {
      return '';
    }
    let keyValueInitValue = '';
    const indexItem = Object.values(this.installation.inputs).findLastIndex(
      (input) => input.name === name,
    );
    const inputItem = this.installation.inputs[indexItem];
    if (inputItem?.default) {
      const splitDefaults = inputItem.default.split(/, ?/);
      if (splitDefaults.length === 2) {
        keyValueInitValue = splitDefaults[mode === 'value' ? 1 : 0];
      }
    }
    return keyValueInitValue;
  };

  keyValueAdd = function keyValueAdd(form, name) {
    this.installation.input[name].push({
      key: form.key.$modelValue,
      value: form.value.$modelValue,
    });
  };

  keyValueRemove = function keyValueRemove(form, name) {
    remove(
      this.installation.input[name],
      (input) =>
        input.key === form.key.$modelValue &&
        input.value === form.value.$modelValue,
    );
  };
}
