export default /* @ngInject */ function IpAntihackService($http, $q) {
  const swsProxypassPath = 'apiv6';

  this.getAntihackDetails = function getAntihackDetails(ipBlock, ip) {
    // return $q.when(true).then(function () {
    //     return {
    //         state: 'blocked',
    //         blockedSince: "2014-08-04T11:46:19+02:00",
    //         time: 55,
    //         logs: "Wed May 7 21:54:15 2014 : arp who-has 5.135.143.254 tell 5.39.15.196\n" +
    //               "Wed May 7 21:54:17 2014 : arp who-has 5.135.143.254 tell 5.39.15.196\n" +
    //               "Wed May 7 21:55:17 2014 : arp who-has 5.135.143.254 tell 5.39.15.196\n" +
    //               "Wed May 7 21:56:53 2014 : arp who-has 5.135.143.254 tell 5.39.15.196\n" +
    //               "Wed May 7 21:56:57 2014 : arp who-has 5.135.143.254 tell 5.39.15.196\n" +
    //               "Wed May 7 21:56:57 2014 : arp who-has 5.135.143.254 tell 5.39.15.196\n" +
    //               "Wed May 7 21:58:38 2014 : arp who-has 5.135.143.254 tell 5.39.15.196\n" +
    //               "Wed May 7 21:58:38 2014 : arp who-has 5.135.143.254 tell 5.39.15.196\n" +
    //               "Wed May 7 21:58:41 2014 : arp who-has 5.135.143.254 tell 5.39.15.196\n" +
    //               "Wed May 7 21:58:44 2014 : arp who-has 5.135.143.254 tell 5.39.15.196\n"
    //     }
    // })
    return $http
      .get(
        [
          swsProxypassPath,
          `ip/${window.encodeURIComponent(ipBlock)}/antihack/${ip}`,
        ].join('/'),
      )
      .then(
        (data) => data.data,
        (http) => $q.reject(http.data),
      );
  };

  this.unblockIp = function unblockIp(ipBlock, ip) {
    return $http
      .post(
        [
          swsProxypassPath,
          `ip/${window.encodeURIComponent(ipBlock)}/antihack/${ip}/unblock`,
        ].join('/'),
      )
      .then(
        (data) => data.data,
        (http) => $q.reject(http.data),
      );
  };
}
