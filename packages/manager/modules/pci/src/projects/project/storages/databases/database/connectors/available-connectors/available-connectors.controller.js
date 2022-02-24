import capitalize from 'lodash/capitalize';

export default class {
  /* @ngInject */
  constructor($translate, CucCloudMessage, DatabaseService) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.DatabaseService = DatabaseService;
    this.getType = (item) => capitalize(item.type);
  }

  $onInit() {
    this.trackDashboard('available-connectors', 'page');
  }
}
