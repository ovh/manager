import set from 'lodash/set';

export default class IpDashboardVirtualMac {
  /* @ngInject */
  constructor($http, $q, Poll) {
    this.$http = $http;
    this.$q = $q;
    this.Poll = Poll;

    this.swsIpPath = '2api/sws/module/ip';
    this.swsProxypassPath = 'apiv6';
  }

  static getVirtualMacListSanitized(data) {
    // Generate virtualMacsByIp
    if (data && data.virtualMacs) {
      set(data, 'virtualMacsByIp', {});
      angular.forEach(data.virtualMacs, (ips, virtualmac) => {
        angular.forEach(ips, (ip) => {
          // eslint-disable-next-line no-param-reassign
          data.virtualMacsByIp[ip] = virtualmac;
        });
      });
    }
    return data;
  }

  getVirtualMacList(service) {
    return this.$http
      .get(
        `/sws/module/ip/${service.category}/${service.serviceName}/virtualMac`,
        { serviceType: 'aapi' },
      )
      .then((response) =>
        IpDashboardVirtualMac.getVirtualMacListSanitized(response.data),
      )
      .catch((http) => this.$q.reject(http.data));
  }

  pollVirtualMacs(service) {
    return this.Poll.poll(
      `${this.swsIpPath}/${service.category}/${service.serviceName}/virtualMac`,
      null,
      { successRule: { status: 'OK' }, namespace: 'ip.virtualmac' },
    )
      .then((data) => IpDashboardVirtualMac.getVirtualMacListSanitized(data))
      .catch((http) => this.$q.reject(http.data));
  }

  killPollVirtualMacs() {
    return this.Poll.kill({ namespace: 'ip.virtualmac' });
  }

  addVirtualMacToIp(serviceName, ipAddress, type, virtualMachineName) {
    return this.$http
      .post(
        `${this.swsProxypassPath}/dedicated/server/${serviceName}/virtualMac`,
        {
          ipAddress,
          type,
          virtualMachineName,
        },
      )
      .then((data) => data.data)
      .catch((http) => this.$q.reject(http.data));
  }

  addIpToVirtualMac(serviceName, macAddress, ipAddress, virtualMachineName) {
    return this.$http
      .post(
        `${this.swsProxypassPath}/dedicated/server/${serviceName}/virtualMac/${macAddress}/virtualAddress`,
        { ipAddress, virtualMachineName },
      )
      .then((data) => data.data)
      .catch((http) => this.$q.reject(http.data));
  }

  deleteVirtualMac(serviceName, macAddress, ipAddress) {
    return this.$http
      .delete(
        `${this.swsProxypassPath}/dedicated/server/${serviceName}/virtualMac/${macAddress}/virtualAddress/${ipAddress}`,
      )
      .then((data) => data.data)
      .catch((http) => this.$q.reject(http.data));
  }

  getVirtualMacDetails(serviceName, macAddress, ipAddress) {
    const queue = [];
    queue.push(
      this.$http
        .get(
          `${this.swsProxypassPath}/dedicated/server/${serviceName}/virtualMac/${macAddress}`,
        )
        .then((data) => data.data)
        .catch((http) => this.$q.reject(http.data)),
    );
    queue.push(
      this.$http
        .get(
          `${this.swsProxypassPath}/dedicated/server/${serviceName}/virtualMac/${macAddress}/virtualAddress/${ipAddress}`,
        )
        .then((data) => data.data)
        .catch((http) => this.$q.reject(http.data)),
    );

    return this.$q.all(queue).then((details) => {
      if (details.length && details[0] && details[1]) {
        return angular.extend(details[0], details[1]);
      }
      return null;
    });
  }
}
