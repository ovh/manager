export default class {
  /* @ngInject */
  constructor(OvhHttp) {
    this.OvhHttp = OvhHttp;
  }

  deleteLicense(serviceName, datacenterId, vmId) {
    return this.OvhHttp.post(
      `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/vm/${vmId}/removeLicense`,
      {
        rootPath: 'apiv6',
      },
    );
  }
}
