export default class OomService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;

    this.swsProxypassPath = 'hosting/privateDatabase';

    this.rootPath = 'apiv6';
  }

  getOomList(serviceName) {
    return this.$http
      .get(`${this.rootPath}/${this.swsProxypassPath}/${serviceName}/oom`)
      .then((res) => res.data);
  }
}
