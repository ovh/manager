import set from 'lodash/set';

angular.module('Module.ip.services').service('IpVirtualMac', [
  '$http',
  '$q',
  'constants',
  'Poll',
  function IpVirtualMacService($http, $q, constants, Poll) {
    const swsIpPath = '2api/sws/module/ip';
    const swsProxypassPath = 'apiv6';

    function getVirtualMacListSanitized(data) {
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

    this.pollVirtualMacs = (service) =>
      Poll.poll(
        `${swsIpPath}/${service.category}/${service.serviceName}/virtualMac`,
        null,
        { successRule: { status: 'OK' }, namespace: 'ip.virtualmac' },
      ).then((data) => getVirtualMacListSanitized(data));

    this.killPollVirtualMacs = () => Poll.kill({ namespace: 'ip.virtualmac' });

    this.addVirtualMacToIp = (
      serviceName,
      ipAddress,
      type,
      virtualMachineName,
    ) =>
      $http
        .post(
          `${swsProxypassPath}/dedicated/server/${serviceName}/virtualMac`,
          { ipAddress, type, virtualMachineName },
        )
        .then(
          (data) => data.data,
          (http) => $q.reject(http.data),
        );

    this.addIpToVirtualMac = (
      serviceName,
      macAddress,
      ipAddress,
      virtualMachineName,
    ) =>
      $http
        .post(
          `${swsProxypassPath}/dedicated/server/${serviceName}/virtualMac/${macAddress}/virtualAddress`,
          { ipAddress, virtualMachineName },
        )
        .then(
          (data) => data.data,
          (http) => $q.reject(http.data),
        );

    this.deleteVirtualMac = (serviceName, macAddress, ipAddress) =>
      $http
        .delete(
          `${swsProxypassPath}/dedicated/server/${serviceName}/virtualMac/${macAddress}/virtualAddress/${ipAddress}`,
        )
        .then(
          (data) => data.data,
          (http) => $q.reject(http.data),
        );

    this.getVirtualMacDetails = (serviceName, macAddress, ipAddress) => {
      const queue = [];
      queue.push(
        $http
          .get(
            `${swsProxypassPath}/dedicated/server/${serviceName}/virtualMac/${macAddress}`,
          )
          .then(
            (data) => data.data,
            (http) => $q.reject(http.data),
          ),
      );
      queue.push(
        $http
          .get(
            `${swsProxypassPath}/dedicated/server/${serviceName}/virtualMac/${macAddress}/virtualAddress/${ipAddress}`,
          )
          .then(
            (data) => data.data,
            (http) => $q.reject(http.data),
          ),
      );

      return $q.all(queue).then((details) => {
        if (details.length && details[0] && details[1]) {
          return angular.extend(details[0], details[1]);
        }
        return null;
      });
    };
  },
]);
