export default class {
  /* @ngInject */
  constructor($translate, CucCloudMessage, DatabaseService) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.DatabaseService = DatabaseService;
  }

  $onInit() {
    this.trackDashboard('connector-config', 'page');
    this.model = {
      name: this.connector.name,
      ...this.connector.configuration,
    };
  }

  getModelValue() {
    const value = {};
    Object.keys(this.model).forEach((field) => {
      if (![null, undefined, ''].includes(this.model[field])) {
        value[field] = `${this.model[field]}`;
      }
    });
    return value;
  }
}
