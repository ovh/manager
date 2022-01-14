import { GUIDES } from './anthos.constants';

export default class AnthosTenantsService {
  /* @ngInject */
  constructor($http, $q, $translate, ovhDocUrl, coreConfig) {
    this.$http = $http;
    this.$q = $q;
    this.$translate = $translate;
    this.ovhDocUrl = ovhDocUrl;
    this.user = coreConfig.getUser();
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

  getAccessRestrictions(serviceName) {
    return this.$http.get(
      `/dedicated/anthos/tenants/${serviceName}/ipRestrictions`,
    );
  }

  createAccessRestriction(serviceName, ipBlock) {
    return this.$http.post(
      `/dedicated/anthos/tenants/${serviceName}/ipRestrictions`,
      {
        ips: [ipBlock],
      },
    );
  }

  updateAccessRestriction(serviceName, oldIpBlock, newIpBlock) {
    return this.deleteAccessRestriction(serviceName, oldIpBlock).then(() =>
      this.createAccessRestriction(serviceName, newIpBlock),
    );
  }

  deleteAccessRestriction(serviceName, ipBlock) {
    const encodedIpBlock = encodeURIComponent(ipBlock);
    return this.$http.delete(
      `/dedicated/anthos/tenants/${serviceName}/ipRestrictions/${encodedIpBlock}`,
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

  getAvailableVersions(serviceName) {
    return this.fetch(
      `/dedicated/anthos/tenants/${serviceName}/availableVersions`,
    );
  }

  addTenantPrivateIP(serviceName, range) {
    return this.$http
      .post(`/dedicated/anthos/tenants/${serviceName}/ips/private`, range)
      .then(({ data }) => data);
  }

  removeTenantPrivateIP(serviceName, rangeId) {
    return this.$http.delete(
      `/dedicated/anthos/tenants/${serviceName}/ips/private/${rangeId}`,
    );
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

  getServiceInfo(serviceName) {
    return this.$http
      .get(`/dedicated/anthos/tenants/${serviceName}/serviceInfos`)
      .then(({ data }) => data);
  }

  getOptions(serviceId) {
    return this.$http
      .get(`/services/${serviceId}/options`)
      .then(({ data }) => data);
  }

  getHostService(serviceName, hostId) {
    return this.getServiceInfo(serviceName)
      .then(({ serviceId }) => this.getOptions(serviceId))
      .then((options) =>
        options.find((option) => option.resource?.name === hostId),
      );
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

  terminateServiceById(serviceId) {
    return this.$http
      .post(`/services/${serviceId}/terminate`, {
        acknowledgePotentialFees: true,
      })
      .then(({ data }) => data);
  }

  getAnthosCatalog() {
    const {
      user: { ovhSubsidiary },
    } = this;
    return this.$http
      .get(`/order/catalog/public/anthos?ovhSubsidiary=${ovhSubsidiary}`)
      .then(({ data }) => data);
  }

  updateSoftware(serviceName, version) {
    return this.$http
      .post(`/dedicated/anthos/tenants/${serviceName}/actions/upgrade`, {
        version,
      })
      .then(({ data }) => data);
  }

  getPackInfo(serviceInfo) {
    const { serviceId } = serviceInfo;
    return this.$q
      .all({
        catalog: this.getAnthosCatalog(),
        current: this.$http.get(`/services/${serviceId}`).then(({ data }) => {
          const {
            billing: {
              plan: { code, ...plan },
            },
          } = data;
          plan.planCode = code;
          return plan;
        }),
        upgrades: this.$http
          .get(`/services/${serviceId}/upgrade`)
          .then(({ data }) => data),
      })
      .then(({ catalog, current, upgrades }) => ({
        current,
        upgrades: upgrades.map((pack) => ({
          ...pack,
          invoiceName:
            catalog.plans.find(({ planCode }) => planCode === pack.planCode)
              ?.invoiceName || '',
        })),
      }));
  }
}
