import 'moment';

export default class PciStoragesColdArchiveService {
  /* @ngInject */
  constructor($http, $q, OvhApiCloudProjectUser) {
    this.$http = $http;
    this.$q = $q;
    this.OvhApiCloudProjectUser = OvhApiCloudProjectUser;
  }
}
