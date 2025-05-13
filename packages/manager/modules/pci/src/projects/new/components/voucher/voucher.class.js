export default class PciVoucher {
  constructor(options = {}) {
    // options available from APIs
    this.value = options.value || null;
    this.valid = options.valid || false;
    this.paymentMethodRequired = options.paymentMethodRequired || false;
    this.credit = options.credit || null;

    // other options
    this.error = options.error || null;
  }

  setInfos(infos) {
    // reset before
    this.reset();

    if (infos.error) {
      // set validity
      this.valid = false;
      // set error info
      this.error = {
        status: infos.error,
        statusText: infos.message,
      };
    } else {
      // set validity
      this.valid = true;
      // set other infos
      Object.assign(this, infos);
    }

    return this;
  }

  reset() {
    this.valid = false;
    this.paymentMethodRequired = false;
    this.credit = null;
    this.error = null;

    return this;
  }

  setValue(value) {
    this.value = value;
  }
}
