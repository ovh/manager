import startCase from 'lodash/startCase';

const NUTANIX_LICENCE_ENABLED_ENUM = {
  YES: 'yes',
  NO: 'no',
};
export default class NutanixLicence {
  constructor(name, value) {
    this.name = name;
    this.value = value;
  }

  getName() {
    return this.name;
  }

  getValue() {
    return this.value;
  }

  isEnabled() {
    return this.value === NUTANIX_LICENCE_ENABLED_ENUM.YES;
  }

  /**
   * Returns the start cased string.
   * Ex:
   * startCase('fooBar');
   * => 'Foo Bar'
   */
  getFormattedName() {
    return startCase(this.name);
  }
}
