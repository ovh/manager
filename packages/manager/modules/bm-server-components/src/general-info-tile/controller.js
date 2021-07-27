import isFunction from 'lodash/isFunction';

export default class BmServerComponentsServerGeneralInfoTileController {
  /* @ngInject */
  constructor($translate, coreConfig) {
    this.$translate = $translate;
    this.region = coreConfig.getRegion();
  }

  showNameActions() {
    return this.region !== 'US' && isFunction(this.onEditName);
  }

  editName() {
    if (isFunction(this.onEditName)) {
      this.onEditName({ name: this.server.displayName });
    }
  }

  installOs(type) {
    if (isFunction(this.onOsInstall)) {
      this.onOsInstall({ type });
    }
  }

  editNetboot() {
    if (isFunction(this.onEditNetboot)) {
      this.onEditNetboot();
    }
  }

  getFormatedCommercialRange() {
    if (this.isHousingRange()) {
      return this.$translate.instant(
        'server_configuration_description_housing',
      );
    }
    return this.server.description || '-';
  }

  isHousingRange() {
    return this.server.commercialRange === 'housing';
  }
}
