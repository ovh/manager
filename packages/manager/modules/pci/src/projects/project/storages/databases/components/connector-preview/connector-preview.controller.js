import { CONNECTOR_FIELDS_TYPE } from '../../../../../../components/project/storages/databases/connectors.constants';

export default class PciConnectorPreviewController {
  getModelValue() {
    const value = {};
    Object.keys(this.data).forEach((field) => {
      if (![null, undefined, ''].includes(this.data[field])) {
        if (
          this.configuration.getField(field)?.type ===
          CONNECTOR_FIELDS_TYPE.PASSWORD
        ) {
          value[field] = `${this.data[field].replace(/./g, '*')}`;
        } else {
          value[field] = `${this.data[field]}`;
        }
      }
    });
    return value;
  }
}
