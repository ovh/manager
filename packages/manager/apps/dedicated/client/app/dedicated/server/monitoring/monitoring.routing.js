import filter from 'lodash/filter';
import flatten from 'lodash/flatten';
import includes from 'lodash/includes';
import map from 'lodash/map';

function compare(x, y) {
  return parseInt(x, 10) - parseInt(y, 10);
}

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated.server.dashboard.monitoring', {
    url: '/monitoring',
    views: {
      'tabView@app.dedicated.server': {
        component: 'dedicatedServerMonitoring',
      },
    },
    resolve: {
      goBack: /* @ngInject */ ($state) => () =>
        $state.go('app.dedicated.server.dashboard'),
      ips: /* @ngInject */ ($stateParams, IpRange, Server) =>
        Server.listIps($stateParams.productId).then((ips) =>
          flatten(
            map(
              filter(ips, (ip) => !includes(ip, ':')),
              (ip) => IpRange.getRangeForIpv4Block(ip),
            ),
          ),
        ),
      languageEnum: /* @ngInject */ (models) =>
        models.data.models['dedicated.server.AlertLanguageEnum'].enum,
      monitoringIntervalEnum: /* @ngInject */ (models) =>
        models.data.models['dedicated.server.MonitoringIntervalEnum'].enum.sort(
          compare,
        ),
      monitoringProtocolEnum: /* @ngInject */ (models) =>
        models.data.models['dedicated.server.MonitoringProtocolEnum'].enum,
      models: /* @ngInject */ (Server) => Server.getModels(),
      sms: /* @ngInject */ ($q, $stateParams, Server) =>
        Server.getSms($stateParams.productId)
          .then((sms) =>
            sms.filter(
              (data) => data.status === 'enable' && data.creditsLeft > 0,
            ),
          )
          .catch((err) => (err.state === 404 ? undefined : $q.reject(err))),
    },
  });
};
