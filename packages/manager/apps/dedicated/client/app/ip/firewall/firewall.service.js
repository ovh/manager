export default class {
  /* @ngInject */
  constructor($http, $q, Poll) {
    this.$http = $http;
    this.$q = $q;
    this.Poll = Poll;

    this.swsProxypassPath = 'apiv6';
  }

  pollFirewallState(ipBlock, ip) {
    return this.Poll.poll(
      [
        this.swsProxypassPath,
        `ip/${window.encodeURIComponent(ipBlock.ipBlock)}/firewall/${ip.ip}`,
      ].join('/'),
      null,
      { successRule: { state: 'ok' }, namespace: 'ip.firewall' },
    );
  }

  pollFirewallRule(ipBlock, ip, sequence) {
    return this.Poll.poll(
      [
        this.swsProxypassPath,
        `ip/${window.encodeURIComponent(
          ipBlock,
        )}/firewall/${ip}/rule/${sequence}`,
      ].join('/'),
      null,
      { successRule: { state: 'ok' }, namespace: 'ip.firewall.rule' },
    );
  }

  killPollFirewallRule(ipBlock, ip, sequence) {
    let pattern;
    if (ipBlock && ip) {
      pattern = {
        url: [
          this.swsProxypassPath,
          `ip/${window.encodeURIComponent(
            ipBlock,
          )}/firewall/${ip}/rule/${sequence}`,
        ].join('/'),
      };
    } else {
      pattern = { namespace: 'ip.firewall.rule' };
    }
    return this.Poll.kill(pattern);
  }

  getIpModels() {
    return this.$http
      .get([this.swsProxypassPath, 'ip.json'].join('/'), { cache: true })
      .then((response) => {
        if (response && response.data && response.data.models) {
          return response.data.models;
        }
        return {};
      })
      .catch((http) => this.$q.reject(http.data));
  }

  addFirewall(ipBlock, ip) {
    return this.$http
      .post(
        [
          this.swsProxypassPath,
          `ip/${window.encodeURIComponent(ipBlock)}/firewall`,
        ].join('/'),
        {
          ipOnFirewall: ip,
        },
        {
          serviceType: 'apiv6',
        },
      )
      .then((data) => data.data)
      .catch((http) => this.$q.reject(http.data));
  }

  toggleFirewall(ipBlock, ip, enabled) {
    return this.$http
      .put(
        [
          this.swsProxypassPath,
          `ip/${window.encodeURIComponent(ipBlock)}/firewall/${ip}`,
        ].join('/'),
        {
          enabled,
        },
        {
          serviceType: 'apiv6',
        },
      )
      .then((data) => data.data)
      .catch((http) => this.$q.reject(http.data));
  }

  getFirewallDetails(ipBlock, ip) {
    const url = [
      '/ip',
      window.encodeURIComponent(ipBlock),
      'firewall',
      ip,
    ].join('/');

    return this.$http
      .get(url, { serviceType: 'apiv6' })
      .then((result) => result.data)
      .catch((http) => this.$q.reject(http.data));
  }

  getFirewallRuleConstants() {
    return this.getIpModels().then((ipModels) => ({
      actions: ipModels['ip.FirewallActionEnum'].enum,
      protocols: ipModels['ip.FirewallProtocolEnum'].enum,
      sequences: ipModels['ip.FirewallSequenceRangeEnum'].enum,
      tcpOptions: ipModels['ip.FirewallTCPOptionEnum'].enum,
    }));
  }

  getFirewallRules(ipBlock, ip, elementsToDisplay, fromIndex) {
    return this.$http
      .get(
        [
          '/sws/module/ip',
          window.encodeURIComponent(ipBlock),
          'firewall',
          ip,
          'rules',
        ].join('/'),
        {
          params: {
            elementsToDisplay,
            fromIndex,
          },
          serviceType: 'aapi',
        },
      )
      .then((result) => result.data)
      .catch((http) => this.$q.reject(http.data));
  }

  addFirewallRule(ipBlock, ip, rule) {
    if (rule.tcpOptions && rule.tcpOptions.option === 'NONE') {
      // eslint-disable-next-line no-param-reassign
      delete rule.tcpOptions.option;
    }

    let isIpBlock = true;

    if (rule.source) {
      isIpBlock = rule.source.search('/') !== -1;
    }
    const url = [
      '/ip',
      window.encodeURIComponent(ipBlock),
      'firewall',
      ip,
      'rule',
    ].join('/');

    const cleanRule = angular.copy(rule);
    cleanRule.sequence = cleanRule.sequence.key;

    if (!isIpBlock) {
      cleanRule.source = `${rule.source}/32`;
    }

    cleanRule.tcpOption = cleanRule.tcpOptions;
    delete cleanRule.tcpOptions;

    return this.$http
      .post(url, cleanRule, { serviceType: 'apiv6' })
      .then((data) => data.data)
      .catch((http) => this.$q.reject(http.data));
  }

  removeFirewallRule(ipBlock, ip, sequence) {
    return this.$http
      .delete(
        [
          '/ip',
          window.encodeURIComponent(ipBlock),
          'firewall',
          ip,
          'rule',
          sequence,
        ].join('/'),
        { serviceType: 'apiv6' },
      )
      .then((data) => data.data)
      .catch((http) => this.$q.reject(http.data));
  }
}
