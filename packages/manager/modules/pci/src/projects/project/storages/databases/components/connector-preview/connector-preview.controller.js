import { CONNECTOR_FIELDS_TYPE } from '../../../../../../components/project/storages/databases/connectors.constants';

export default class PciConnectorPreviewController {
  getModelValue() {
    const value = {};
    Object.keys(this.data).forEach((field) => {
      if (![null, undefined, ''].includes(this.data[field])) {
        const isPassword =
          this.configuration.getField(field)?.type ===
          CONNECTOR_FIELDS_TYPE.PASSWORD;
        value[field] = isPassword
          ? `${this.data[field].replace(/./g, '*')}`
          : `${this.data[field]}`;
      }
    });
    return value;
  }
}
