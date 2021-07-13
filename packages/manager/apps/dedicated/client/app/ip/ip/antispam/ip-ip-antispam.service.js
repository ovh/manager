export default /* @ngInject */ function IpSpamService(
  $http,
  $q,
  constants,
  Poll,
) {
  const aapiIpPath = '/sws/module/ip';

  this.pollSpamState = (block, ipSpamming) =>
    Poll.poll(
      `2api${aapiIpPath}/${window.encodeURIComponent(
        block,
      )}/antispam/${ipSpamming}`,
      null,
      { successRule: { state: 'UNBLOCKED' }, namespace: 'ip.antispam' },
    );

  this.killPollSpamState = () => Poll.kill({ namespace: 'ip.antispam' });

  this.getIpSpam = (block, ipSpamming) =>
    $http
      .get(
        [
          aapiIpPath,
          window.encodeURIComponent(block),
          'antispam',
          ipSpamming,
        ].join('/'),
        { serviceType: 'aapi' },
      )
      .then(
        (data) => data.data,
        (http) => $q.reject(http.data),
      );

  this.getIpSpamStats = (block, ipSpamming, timestamp, count, offset, search) =>
    $http
      .get(
        `${aapiIpPath}/${window.encodeURIComponent(
          block,
        )}/antispam/${ipSpamming}/stats/${timestamp}`,
        {
          serviceType: 'aapi',
          params: {
            elementsByPage: count,
            elementsToSkip: offset,
            search,
          },
        },
      )
      .then(
        (data) => data.data,
        (http) => $q.reject(http.data),
      );

  this.unblockIp = (block, ipSpamming) =>
    $http
      .post(
        `/ip/${window.encodeURIComponent(block)}/spam/${ipSpamming}/unblock`,
        {},
        {
          serviceType: 'apiv6',
        },
      )
      .then((data) => data.data);
}
