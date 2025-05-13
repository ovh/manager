import {
  CLASS_PROPERTY_AS_STRING,
  CONNECTOR_FIELDS_TYPE,
  EXTRA_CONFIG_PROPERTY,
  TRANSFORM_PROPERTY,
} from '../../../../../../components/project/storages/databases/connectors.constants';

export default class PciConnectorInputController {
  $onInit() {
    // Get the type of input to display
    this.getInputType();
    // For booleans, we use an intermediate variable
    if (this.isBooleanInput) {
      this.tempValue = this.model[this.data.name] || 'default';
    }
    // Backend returns data as string, pa
    if (this.model[this.data.name] && this.isNumericInput) {
      this.model[this.data.name] = Number(this.model[this.data.name]);
    }
    this.options = [''].concat(this.data.values);
  }

  getInputType() {
    this.isPasswordInput = this.data.type === CONNECTOR_FIELDS_TYPE.PASSWORD;
    this.isNumericInput = [
      CONNECTOR_FIELDS_TYPE.INT16,
      CONNECTOR_FIELDS_TYPE.INT32,
      CONNECTOR_FIELDS_TYPE.INT64,
    ].includes(this.data.type);
    this.isBooleanInput = this.data.type === CONNECTOR_FIELDS_TYPE.BOOLEAN;
    this.isClassInput =
      this.data.type === CONNECTOR_FIELDS_TYPE.CLASS &&
      !CLASS_PROPERTY_AS_STRING.includes(this.data.name);
    this.isSelectInput =
      this.data.type === CONNECTOR_FIELDS_TYPE.STRING && this.data.values;
    this.isTransformInput = this.data.name === TRANSFORM_PROPERTY;
    this.isExtraConfigInput = this.data.name === EXTRA_CONFIG_PROPERTY;
    this.isListInput =
      this.data.type === CONNECTOR_FIELDS_TYPE.LIST && !this.isTransformInput;
    this.isTextInput =
      (this.data.type === CONNECTOR_FIELDS_TYPE.STRING ||
        CLASS_PROPERTY_AS_STRING.includes(this.data.name)) &&
      !this.isExtraConfigInput &&
      !this.isSelectInput;
  }

  onRadioChange(newVal) {
    if (newVal !== 'default') {
      this.model[this.data.name] = newVal;
    } else {
      this.model[this.data.name] = null;
    }
  }
}
