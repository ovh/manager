import capitalize from 'lodash/capitalize';

export default class {
  /* @ngInject */
  constructor($translate, DatabaseService) {
    this.$translate = $translate;
    this.capitalize = capitalize;
    this.DatabaseService = DatabaseService;
  }

  $onInit() {
    this.trackDatabases(
      'dashboard::general_information::upgrade_version',
      'page',
    );
  }

  cancel() {
    // this.trackDatabases(
    //   'dashboard::general_information::popin_upgrade_version_cancel',
    // );
    this.goBack();
  }
}
