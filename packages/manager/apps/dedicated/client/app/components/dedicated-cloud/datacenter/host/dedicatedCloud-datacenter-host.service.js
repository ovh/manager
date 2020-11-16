export default class {
  /* @ngInject */
  constructor(OvhHttp) {
    this.OvhHttp = OvhHttp;
  }

  getHostHourlyConsumption(serviceName, datacenterId, hostId) {
    return this.OvhHttp.get(
      `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/host/${hostId}/hourlyConsumption`,
      {
        rootPath: 'apiv6',
      },
    );
  }
}
