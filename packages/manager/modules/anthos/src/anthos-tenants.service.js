import { GUIDES } from './anthos.constants';

export default class AnthosTenantsService {
  /* @ngInject */
  constructor($http, $translate, ovhDocUrl) {
    this.$http = $http;
    this.$translate = $translate;
    this.ovhDocUrl = ovhDocUrl;
  }

  fetch(endPoint, headers) {
    return this.$http.get(endPoint, headers).then(({ data }) => data);
  }

  getTenants() {
    return this.fetch('/dedicated/anthos/tenants');
  }

  getTenantDetails(serviceName) {
    return this.fetch(`/dedicated/anthos/tenants/${serviceName}`);
  }

  updateTenant(serviceName, tenant) {
    return this.$http
      .put(`/dedicated/anthos/tenants/${serviceName}`, tenant)
      .then(({ data }) => data);
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

  getTenantStorageUsage(serviceName) {
    return this.fetch(
      `/dedicated/anthos/tenants/${serviceName}/storage/netapp/usage`,
    );
  }

  getTenantPublicIPs(serviceName) {
    return this.fetch(`/dedicated/anthos/tenants/${serviceName}/ips/public`, {
      headers: {
        'X-Pagination-Mode': 'CachedObjectList-Pages',
        'X-Pagination-Size': 50000,
      },
    });
  }

  getTenantPrivateIPs(serviceName) {
    return this.fetch(`/dedicated/anthos/tenants/${serviceName}/ips/private`, {
      headers: {
        'X-Pagination-Mode': 'CachedObjectList-Pages',
        'X-Pagination-Size': 50000,
      },
    });
  }

  resetTenantAdminAccess(serviceName) {
    return this.$http
      .post(`/dedicated/anthos/tenants/${serviceName}/credentials/reset`)
      .then(({ data }) => data);
  }

  resetTenantStorageAdminAccess(serviceName) {
    return this.$http
      .post(
        `/dedicated/anthos/tenants/${serviceName}/storage/netapp/credentials/reset`,
      )
      .then(({ data }) => data);
  }

  getServiceInfo(serviceName) {
    return this.fetch(`/dedicated/anthos/tenants/${serviceName}/serviceInfos`);
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

  addStorage(serviceName, description) {
    return this.$http
      .post(`/dedicated/anthos/tenants/${serviceName}/storage/netapp/svms`, {
        description,
      })
      .then(({ data }) => data);
  }

  removeStorage(serviceName, storageId) {
    return this.$http
      .delete(
        `/dedicated/anthos/tenants/${serviceName}/storage/netapp/svms/${storageId}`,
      )
      .then(({ data }) => data);
  }

  restartHost(serviceName, hostId) {
    return this.$http
      .post(
        `/dedicated/anthos/tenants/${serviceName}/baremetals/${hostId}/actions/restart`,
      )
      .then(({ data }) => data);
  }

  reinstallHost(serviceName, hostId) {
    return this.$http
      .post(
        `/dedicated/anthos/tenants/${serviceName}/baremetals/${hostId}/actions/reinstall`,
      )
      .then(({ data }) => data);
  }

  setHostState(serviceName, hostId, stateful) {
    return this.$http
      .put(`/dedicated/anthos/tenants/${serviceName}/baremetals/${hostId}`, {
        stateful,
      })
      .then(({ data }) => data);
  }
}
