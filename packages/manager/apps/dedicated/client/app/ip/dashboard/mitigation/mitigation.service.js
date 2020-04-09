import snakeCase from 'lodash/snakeCase';

export default class {
  /* @ngInject */
  constructor($http, $q) {
    this.$http = $http;
    this.$q = $q;

    this.swsAapiIpPath = '/sws/module/ip';
    this.swsProxypassPath = 'apiv6';
  }

  updateMitigation(ipBlock, ip, mitigation) {
    if (mitigation === 'PERMANENT') {
      return this.$http
        .post(
          ['/ip', window.encodeURIComponent(ipBlock), 'mitigation'].join('/'),
          { ipOnMitigation: ip },
          { serviceType: 'apiv6' },
        )
        .then((data) => data.data)
        .catch((http) => this.$q.reject(http.data));
    }

    if (mitigation === 'DEFAULT') {
      return this.$http
        .delete(
          ['/ip', window.encodeURIComponent(ipBlock), 'mitigation', ip].join(
            '/',
          ),
          {
            serviceType: 'apiv6',
          },
        )
        .then((data) => data.data)
        .catch((http) => this.$q.reject(http.data));
    }

    return this.$q.reject(ipBlock);
  }

  getMitigationRealTimeStatistics(ipBlock, ip) {
    if (ipBlock && ip) {
      return this.getMitigationStatistics(
        ipBlock,
        ip,
        moment().toISOString(),
        '_5_M',
        30,
      );
    }

    return this.$q.reject(ip);
  }

  getMitigationStatistics(ipBlock, ip, from, scale, pointsCount) {
    let count = 288;

    if (pointsCount) {
      count = pointsCount;
    }

    if (ipBlock && ip && from && scale) {
      return this.$http
        .get(
          [
            this.swsAapiIpPath,
            window.encodeURIComponent(ipBlock),
            'mitigation',
            ip,
            'statistics',
          ].join('/'),
          {
            params: {
              from,
              scale: `_${snakeCase(scale).toUpperCase()}`,
              pointsCount: count,
            },
            serviceType: 'aapi',
          },
        )
        .then((data) => data.data)
        .catch((http) => this.$q.reject(http.data));
    }

    return this.$q.reject(ip);
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

  getMitigationDetails(ipBlock, ip) {
    const url = [
      this.swsProxypassPath,
      window.encodeURIComponent(
        `ip/${window.encodeURIComponent(ipBlock)}/mitigation/${ip}`,
      ),
    ].join('/');

    return this.$http
      .get(url)
      .then((result) => result.data)
      .catch((http) => this.$q.reject(http.data));
  }

  getMitigationStatisticsScale() {
    return this.getIpModels().then((ipModels) =>
      ipModels['ip.MitigationStatsScaleEnum'].enum.map(
        (scale) => `_${snakeCase(scale).toUpperCase()}`,
      ),
    );
  }
}
