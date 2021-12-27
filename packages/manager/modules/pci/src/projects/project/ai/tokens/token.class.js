import merge from 'lodash/merge';

export default class Token {
  /**
   * Create a App instance
   * @param app {Object}: native JS object
   * @param translatedRegion
   * */
  constructor({ createdAt, id, spec, status, updatedAt }, translatedRegion) {
    merge(this, {
      createdAt,
      id,
      spec,
      status,
      updatedAt,
    });
    this.translatedRegion = translatedRegion;
  }

  get name() {
    return this.spec?.name;
  }

  get labelSelector() {
    return this.spec?.labelSelector;
  }

  get role() {
    return this.spec?.role;
  }
}
