export default class {
  /* @ngInject */
  constructor($http) {
    this.project = {};
    this.$http = $http;
  }

  getProjectInfo() {
    return this.project;
  }

  setProjectInfo(project = {}) {
    this.project = project;
  }

  getCustomerRegions(serviceName) {
    return this.$http
      .get(`/cloud/project/${serviceName}/region`)
      .then(({ data: regions }) => regions);
  }
}
