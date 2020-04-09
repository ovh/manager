export default class {
  /* @ngInject */
  constructor($http, $q, Poll) {
    this.$http = $http;
    this.$q = $q;
    this.Poll = Poll;

    this.swsProxypassPath = 'apiv6/ip';
  }

  pollRuleState(ipBlock, ip, ruleId) {
    return this.Poll.poll(
      [
        this.swsProxypassPath,
        [
          window.encodeURIComponent(ipBlock),
          'game',
          window.encodeURIComponent(ip),
          'rule',
        ].join('/'),
        ruleId,
      ].join('/'),
      null,
      { successRule: { state: 'ok' }, namespace: 'ip.firewallGame' },
    );
  }

  pollFirewallState(ipBlock, ip) {
    return this.Poll.poll(
      [
        this.swsProxypassPath,
        [
          window.encodeURIComponent(ipBlock),
          'game',
          window.encodeURIComponent(ip),
        ].join('/'),
      ].join('/'),
      null,
      { successRule: { state: 'ok' }, namespace: 'ip.firewallGame' },
    );
  }

  killPollRuleState() {
    return this.Poll.kill({ namespace: 'ip.firewallGame' });
  }

  get(ipBlock, ip) {
    return this.$http
      .get(
        [
          this.swsProxypassPath,
          [
            window.encodeURIComponent(ipBlock),
            'game',
            window.encodeURIComponent(ip),
          ].join('/'),
        ].join('/'),
      )
      .then((result) => result.data)
      .catch((http) => this.$q.reject(http.data));
  }

  getRules(ipBlock, ip) {
    return this.$http
      .get(
        [
          this.swsProxypassPath,
          [
            window.encodeURIComponent(ipBlock),
            'game',
            window.encodeURIComponent(ip),
            'rule',
          ].join('/'),
        ].join('/'),
      )
      .then((result) => result.data)
      .catch((http) => this.$q.reject(http.data));
  }

  getRule(ipBlock, ip, ruleId) {
    return this.$http
      .get(
        [
          this.swsProxypassPath,
          [
            window.encodeURIComponent(ipBlock),
            'game',
            window.encodeURIComponent(ip),
            'rule',
          ].join('/'),
          ruleId,
        ].join('/'),
      )
      .then((result) => result.data)
      .catch((http) => this.$q.reject(http.data));
  }

  postRule(ipBlock, ip, rule) {
    return this.$http
      .post(
        [
          this.swsProxypassPath,
          [
            window.encodeURIComponent(ipBlock),
            'game',
            window.encodeURIComponent(ip),
            'rule',
          ].join('/'),
        ].join('/'),
        rule,
      )
      .then((result) => result.data)
      .catch((http) => this.$q.reject(http.data));
  }

  deleteRule(ipBlock, ip, ruleId) {
    return this.$http
      .delete(
        [
          this.swsProxypassPath,
          [
            window.encodeURIComponent(ipBlock),
            'game',
            window.encodeURIComponent(ip),
            'rule',
          ].join('/'),
          ruleId,
        ].join('/'),
      )
      .then((result) => result.data)
      .catch((http) => this.$q.reject(http.data));
  }

  putFirewall(ipBlock, ip, enable) {
    return this.$http
      .put(
        [
          this.swsProxypassPath,
          [
            window.encodeURIComponent(ipBlock),
            'game',
            window.encodeURIComponent(ip),
          ].join('/'),
        ].join('/'),
        {
          firewallModeEnabled: enable,
        },
      )
      .then((result) => result.data)
      .catch((http) => this.$q.reject(http.data));
  }
}
