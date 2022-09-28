export default class {
  /* @ngInject */
  constructor($http, $q) {
    this.project = {};
    this.$http = $http;
    this.$q = $q;
  }

  getProjectInfo() {
    return this.project;
  }

  setProjectInfo(project = {}) {
    this.project = project;
  }

  getServiceInfo(serviceName) {
    return this.$http
      .get(`/cloud/project/${serviceName}/serviceInfos`)
      .then(({ data }) => data)
      .catch(() => ({}));
  }

  getCustomerRegions(serviceName, withPaginationMode = false) {
    const requestHeader = withPaginationMode
      ? {
          'X-Pagination-Mode': 'CachedObjectList-Pages',
        }
      : null;
    return this.$http
      .get(`/cloud/project/${serviceName}/region`, {
        headers: requestHeader,
      })
      .then(({ data: regions }) => regions);
  }

  getStorageRegions(projectId, regionCapacity) {
    return this.getCustomerRegions(projectId, true).then((regions) => {
      return regions.filter(({ services }) =>
        services.find(({ name }) => name === regionCapacity),
      );
    });
  }

  getS3StorageRegions(projectId, regionCapacity) {
    return this.getCustomerRegions(projectId, true).then((regions) => {
      return regions.filter(({ services }) =>
        services.find(
          ({ name }) =>
            name === regionCapacity[0] || name === regionCapacity[1],
        ),
      );
    });
  }

  getVouchersCreditDetails(serviceName) {
    return this.$http
      .get(`/cloud/project/${serviceName}/credit`)
      .then((creditIds) => {
        return this.$q.all(
          creditIds?.data.map((creditId) =>
            this.$http.get(`/cloud/project/${serviceName}/credit/${creditId}`),
          ),
        );
      })
      .then((creditsDetails) => creditsDetails)
      .catch(() => []);
  }
}
