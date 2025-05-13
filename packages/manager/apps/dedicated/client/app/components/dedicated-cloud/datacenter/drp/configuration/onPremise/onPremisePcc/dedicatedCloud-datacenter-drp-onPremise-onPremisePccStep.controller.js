export default class {
  validateConfiguration() {
    this.isValidating = true;

    return this.setupConfiguration(this.drpInformations).finally(() => {
      this.isValidating = false;
    });
  }
}
