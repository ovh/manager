export default class PciConnectorPreviewController {
  getModelValue() {
    const value = {};
    Object.keys(this.data).forEach((field) => {
      if (![null, undefined, ''].includes(this.data[field])) {
        value[field] = `${this.data[field]}`;
      }
    });
    return value;
  }
}
