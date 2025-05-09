export default class exchangeHeaderService {
  /* @ngInject */
  constructor($q, OvhHttp, coreConfig) {
    this.$q = $q;
    this.OvhHttp = OvhHttp;
    this.coreConfig = coreConfig;
  }

  getOfficeTenantServiceName(serviceName, region = 'EU') {
    if (region !== 'EU') {
      return this.$q.resolve(null);
    }

    return this.OvhHttp.get(`/msServices/${serviceName}`, {
      rootPath: 'apiv6',
    }).then((service) => service.officeTenantServiceName);
  }

  getUserSubsidiary() {
    return this.$q
      .when(this.coreConfig.getUser())
      .then((data) => data.ovhSubsidiary);
  }

  updateServiceDisplayName(organizationName, exchangeService, displayName) {
    return this.OvhHttp.put(
      `/email/exchange/${organizationName}/service/${exchangeService}`,
      {
        rootPath: 'apiv6',
        data: {
          displayName,
        },
      },
    );
  }
}
