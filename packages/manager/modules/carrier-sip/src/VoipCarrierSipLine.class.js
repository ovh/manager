export default class VoipCarrierSipLine {
  /* @ngInject */
  constructor(options) {
    Object.assign(this, options);
  }

  getDisplayedName() {
    return this.description || this.serviceName;
  }
}
