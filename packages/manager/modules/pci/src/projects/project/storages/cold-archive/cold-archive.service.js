/* eslint-disable no-console */
import 'moment';

export default class PciStoragesColdArchiveService {
  /* @ngInject */
  constructor($http, $q, OvhApiCloudProjectUser) {
    this.$http = $http;
    this.$q = $q;
    this.OvhApiCloudProjectUser = OvhApiCloudProjectUser;
  }

  /**
   * The implementation of this function will be done in
   * the scope of the task MANAGER-9179 which list the Cold
   * archives associated to the user account.
   */
  // eslint-disable-next-line class-methods-use-this
  getAllColdArchives() {
    return [];
  }
}
