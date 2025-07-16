export default class {
  validateConfiguration() {
    this.isValidating = true;

    return this.setupConfiguration(this.zertoInformations).finally(() => {
      this.isValidating = false;
    });
  }
}
