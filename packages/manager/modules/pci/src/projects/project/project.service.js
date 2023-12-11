import {
  URL_INFO,
  DISCOVERY_PROJECT_ACTIVATION_PAYLOAD,
} from './project.constants';

export default class {
  /* @ngInject */
  constructor($http, iceberg, coreConfig) {
    this.project = {};
    this.$http = $http;
    this.iceberg = iceberg;
    this.coreConfig = coreConfig;
  }

  getProjectInfo() {
    return this.project;
  }

  getDocumentUrl(type) {
    const { ovhSubsidiary } = this.coreConfig.getUser();
    return URL_INFO[type][ovhSubsidiary] || URL_INFO[type].DEFAULT;
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
          'X-Pagination-Size': 5000,
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
    return this.iceberg(`/cloud/project/${serviceName}/credit`)
      .query()
      .expand('CachedObjectList-Pages')
      .execute(null, true)
      .$promise.then(({ data }) => data)
      .catch(() => []);
  }

  activateDiscoveryProject(serviceId) {
    return this.$http.post(
      `/services/${serviceId}/upgrade/project.2018/execute`,
      DISCOVERY_PROJECT_ACTIVATION_PAYLOAD,
    );
  }

  claimVoucher(projectId, data) {
    return this.$http.post(`/cloud/project/${projectId}/credit`, data);
  }
}
