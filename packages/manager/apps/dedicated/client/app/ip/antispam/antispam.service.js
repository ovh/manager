export default class {
  /* @ngInject */
  constructor($http, $q, Poll) {
    this.$http = $http;
    this.$q = $q;
    this.Poll = Poll;

    this.aapiIpPath = '/sws/module/ip';
  }

  pollSpamState(block, ipSpamming) {
    return this.Poll.poll(
      `2api${this.aapiIpPath}/${window.encodeURIComponent(
        block,
      )}/antispam/${ipSpamming}`,
      null,
      { successRule: { state: 'UNBLOCKED' }, namespace: 'ip.antispam' },
    );
  }

  killPollSpamState() {
    return this.Poll.kill({ namespace: 'ip.antispam' });
  }

  getIpSpam(block, ipSpamming) {
    return this.$http
      .get(
        [
          this.aapiIpPath,
          window.encodeURIComponent(block),
          'antispam',
          ipSpamming,
        ].join('/'),
        { serviceType: 'aapi' },
      )
      .then((data) => data.data)
      .catch((http) => this.$q.reject(http.data));
  }

  getIpSpamStats(block, ipSpamming, timestamp, count, offset, search) {
    return this.$http
      .get(
        `${this.aapiIpPath}/${window.encodeURIComponent(
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
      .then((data) => data.data)
      .catch((http) => this.$q.reject(http.data));
  }

  unblockIp(block, ipSpamming) {
    return this.$http
      .post(
        `/ip/${window.encodeURIComponent(block)}/spam/${ipSpamming}/unblock`,
        {},
        {
          serviceType: 'apiv6',
        },
      )
      .then((data) => data.data)
      .catch((http) => this.$q.reject(http.data));
  }
}
