import snakeCase from 'lodash/snakeCase';

angular.module('Module.ip.services').service('IpMitigation', [
  '$http',
  '$q',
  'constants',
  'Poll',
  function IpMitigationService($http, $q, constants, Poll) {
    const swsAapiIpPath = '/sws/module/ip';
    const swsProxypassPath = 'apiv6';
    const self = this;

    this.pollMitigationState = function pollMitigationState(ipBlock, ip) {
      return Poll.poll(
        [
          swsProxypassPath,
          `ip/${encodeURIComponent(
            ipBlock.ipBlock,
          )}/mitigation/${encodeURIComponent(ip.ip)}`,
        ].join('/'),
        null,
        { successRule: { state: 'ok' }, namespace: 'ip.mitigation' },
      );
    };

    this.killPollMitigationState = function killPollMitigationState(
      ipBlock,
      ip,
    ) {
      let pattern;
      if (ipBlock && ip) {
        pattern = {
          url: [
            swsProxypassPath,
            `ip/${encodeURIComponent(
              ipBlock.ipBlock,
            )}/mitigation/${encodeURIComponent(ip.ip)}`,
          ].join('/'),
        };
      } else {
        pattern = { namespace: 'ip.mitigation' };
      }
      return Poll.kill(pattern);
    };

    this.updateMitigation = function updateMitigation(ipBlock, ip, mitigation) {
      if (mitigation === 'PERMANENT') {
        return $http
          .post(
            ['/ip', encodeURIComponent(ipBlock), 'mitigation'].join('/'),
            { ipOnMitigation: ip },
            { serviceType: 'apiv6' },
          )
          .then(
            (data) => data.data,
            (http) => $q.reject(http.data),
          );
      }
      if (mitigation === 'DEFAULT') {
        return $http
          .delete(
            ['/ip', encodeURIComponent(ipBlock), 'mitigation', ip].join('/'),
            {
              serviceType: 'apiv6',
            },
          )
          .then(
            (data) => data.data,
            (http) => $q.reject(http.data),
          );
      }
      return $q.reject(ipBlock);
    };

    this.getMitigationDetails = function getMitigationDetails(ipBlock, ip) {
      const url = [
        swsProxypassPath,
        `ip/${encodeURIComponent(ipBlock)}/mitigation/${encodeURIComponent(
          ip,
        )}`,
      ].join('/');
      return $http.get(url).then(
        (result) => result.data,
        (http) => $q.reject(http.data),
      );
    };

    this.getMitigationStatisticsScale = function getMitigationStatisticsScale() {
      return self
        .getIpModels()
        .then((ipModels) =>
          ipModels['ip.MitigationStatsScaleEnum'].enum.map(
            (scale) => `_${snakeCase(scale).toUpperCase()}`,
          ),
        );
    };

    this.getIpModels = function getIpModels() {
      return $http
        .get([swsProxypassPath, 'ip.json'].join('/'), { cache: true })
        .then((response) => {
          if (response && response.data && response.data.models) {
            return response.data.models;
          }
          return {};
        });
    };

    this.getMitigationStatistics = function getMitigationStatistics(
      ipBlock,
      ip,
      from,
      scale,
      pointsCount,
    ) {
      let count = 288;
      if (pointsCount) {
        count = pointsCount;
      }
      if (ipBlock && ip && from && scale) {
        return $http
          .get(
            [
              swsAapiIpPath,
              encodeURIComponent(ipBlock),
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
          .then(
            (data) => data.data,
            (http) => $q.reject(http.data),
          );
      }
      return $q.reject(ip);
    };

    this.getMitigationRealTimeStatistics = function getMitigationRealTimeStatistics(
      ipBlock,
      ip,
    ) {
      if (ipBlock && ip) {
        return self.getMitigationStatistics(
          ipBlock,
          ip,
          moment().toISOString(),
          '_5_M',
          30,
        );
      }
      return $q.reject(ip);
    };
  },
]);
