import { GUIDES } from './anthos.constants';

export default class AnthosTenantsService {
  /* @ngInject */
  constructor($http, $translate, ovhDocUrl) {
    this.$http = $http;
    this.$translate = $translate;
    this.ovhDocUrl = ovhDocUrl;
  }

  getTenants() {
    return this.$http.get('/dedicated/anthos/tenants').then(({ data }) => data);
  }

  getTenantDetails(serviceName) {
    return this.$http
      .get(`/dedicated/anthos/tenants/${serviceName}`)
      .then(({ data }) => data);
  }

  getGuides(ovhSubsidiary) {
    const guides = {};
    guides.title = this.$translate.instant('anthos_tenants_guides');
    guides.list = [
      {
        name: this.$translate.instant('anthos_tenants_guides_all'),
        url: GUIDES[ovhSubsidiary] || GUIDES.DEFAULT,
        external: true,
      },
    ];

    return guides;
  }

  getHosts(serviceName, additional, pageNumber, pageSize) {
    return this.$http.get(
      `/dedicated/anthos/tenants/${serviceName}/baremetals`,
      {
        headers: {
          Pragma: 'no-cache',
          'X-Pagination-Mode': 'CachedObjectList-Pages',
          'X-Pagination-Number': pageNumber,
          'X-Pagination-Size': pageSize,
          ...(typeof additional === 'undefined'
            ? {}
            : {
                'X-Pagination-Filter': `additional:eq=${additional}`,
              }),
        },
      },
    );
  }

  getStorageVolumes(serviceName) {
    return this.$http
      .get(`/dedicated/anthos/tenants/${serviceName}/storage/netapp/svms`, {
        headers: {
          'X-Pagination-Mode': 'CachedObjectList-Pages',
          'X-Pagination-Size': 50000, // Expected to get only around 1-50 records
        },
      })
      .then(({ data }) => data);
  }

  getStorageUsage(serviceName) {
    return this.$http
      .get(`/dedicated/anthos/tenants/${serviceName}/storage/netapp/usage`)
      .then(({ data }) => data);
  }
}
