export default class {
  /* @ngInject */
  constructor(OvhHttp) {
    this.OvhHttp = OvhHttp;
  }

  fetchLegacyHourlyConsumption(serviceName, datacenterId, filerId) {
    return this.OvhHttp.get(
      `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/filer/${filerId}/hourlyConsumption`,
      {
        rootPath: 'apiv6',
      },
    );
  }

  convertToGlobal(serviceName, datacenterId, filerId) {
    return this.OvhHttp.post(
      `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/filer/${filerId}/convertToGlobal`,
      {
        rootPath: 'apiv6',
      },
    );
  }
}
