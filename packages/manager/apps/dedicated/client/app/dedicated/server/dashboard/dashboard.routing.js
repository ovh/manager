import includes from 'lodash/includes';
import isEmpty from 'lodash/isEmpty';

import { ELIGIBLE_FOR_UPGRADE } from './dashboard.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated.server.dashboard', {
    url: '',
    views: {
      'tabView@app.dedicated.server': {
        component: 'dedicatedServerDashboard',
      },
    },
    resolve: {
      bandwidthInformations: /* @ngInject */ (
        $q,
        $stateParams,
        BandwidthVrackOrderService,
        Server,
      ) =>
        $q
          .all({
            bandwidth: Server.getBandwidth($stateParams.productId),
            bandwidthVrackOption: Server.getBandwidthVrackOption(
              $stateParams.productId,
            ),
            bandwidthVrackOrderOptions: BandwidthVrackOrderService.getOrderableBandwidths(
              $stateParams.productId,
            ),
          })
          .then(
            ({ bandwidth, bandwidthVrackOption, bandwidthVrackOrderOptions }) =>
              Server.getBandwidthOption($stateParams.productId, bandwidth).then(
                (bandwidthOption) => ({
                  bandwidth,
                  bandwidthOption,
                  bandwidthVrackOption,
                  bandwidthVrackOrderOptions,
                }),
              ),
          ),
      biosSettings: /* @ngInject */ ($http, $q, serverName) =>
        $http
          .get(`/dedicated/server/${serverName}/biosSettings`)
          .then((biosSettings) => {
            const { supportedSettings } = biosSettings.data;

            if (supportedSettings.sgx) {
              return $q
                .all({
                  sgx: $http.get(
                    `/dedicated/server/${serverName}/biosSettings/sgx`,
                  ),
                  sgxDoingTasks: $http.get(
                    `/dedicated/server/${serverName}/task?function=ipmi/configureSGX&status=doing`,
                  ),
                  sgxInitTasks: $http.get(
                    `/dedicated/server/${serverName}/task?function=ipmi/configureSGX&status=init`,
                  ),
                  sgxTodoTasks: $http.get(
                    `/dedicated/server/${serverName}/task?function=ipmi/configureSGX&status=todo`,
                  ),
                })
                .then(({ sgx, sgxDoingTasks, sgxInitTasks, sgxTodoTasks }) => ({
                  sgx: {
                    isRunning:
                      !isEmpty(sgxDoingTasks.data) ||
                      !isEmpty(sgxInitTasks.data) ||
                      !isEmpty(sgxTodoTasks.data),
                    status: sgx.data.status,
                    prmrr: sgx.data.prmrr,
                  },
                }));
            }

            return {};
          })
          .catch((error) => (error.status === 404 ? {} : $q.reject(error))),
      changeOwnerUrl: /* @ngInject */ (User) => User.getUrlOf('changeOwner'),
      eligibleData: /* @ngInject */ (Server, user) => {
        const isEligible = includes(
          ELIGIBLE_FOR_UPGRADE.SUBSIDIARIES,
          user.ovhSubsidiary,
        );

        if (isEligible) {
          return Server.getUpgradeProductName(
            ELIGIBLE_FOR_UPGRADE.PLAN_NAME,
            user.ovhSubsidiary,
          ).then((upgradeName) => ({
            isEligible,
            upgradeName,
          }));
        }

        return {
          isEligible: false,
        };
      },
      goToDashboard: /* @ngInject */ ($state, Alerter) => (
        params = {},
        transitionParams,
      ) => {
        const promise = $state.go(
          'app.dedicated.server.dashboard',
          params,
          transitionParams,
        );

        const { message } = params;
        if (message) {
          promise.then(() => {
            Alerter.alertFromSWS(
              message.text,
              message.type,
              message.id || 'server_dashboard_alert',
            );
          });
        }

        return promise;
      },
      goToSgxIntroduction: /* @ngInject */ ($state, atInternet) => () => {
        atInternet.trackClick({
          name: 'dedicated::dedicated::server::dashboard::sgx::manage',
          type: 'action',
        });

        return $state.go('app.dedicated.server.dashboard.sgx.introduction');
      },
      goToSgxManage: /* @ngInject */ ($state, atInternet) => () => {
        atInternet.trackClick({
          name: 'dedicated::dedicated::server::dashboard::sgx::manage',
          type: 'action',
        });

        return $state.go('app.dedicated.server.dashboard.sgx.manage');
      },
      monitoringProtocolEnum: /* @ngInject */ (Server) =>
        Server.getModels().then(
          (models) =>
            models.data.models['dedicated.server.MonitoringProtocolEnum'].enum,
        ),
      orderPrivateBandwidthLink: /* @ngInject */ (
        $state,
        isLegacy,
        serverName,
      ) =>
        isLegacy
          ? $state.href(
              'app.dedicated.server.dashboard.bandwidth-legacy-private-order',
              { productId: serverName },
            )
          : $state.href(
              'app.dedicated.server.dashboard.bandwidth-private-order',
              { productId: serverName },
            ),
      orderPublicBandwidthLink: /* @ngInject */ (
        $state,
        isLegacy,
        serverName,
      ) =>
        isLegacy
          ? $state.href(
              'app.dedicated.server.dashboard.bandwidth-legacy-public-order',
              { productId: serverName },
            )
          : $state.href(
              'app.dedicated.server.dashboard.bandwidth-public-order',
              { productId: serverName },
            ),
      serviceMonitoring: /* @ngInject */ ($stateParams, Server) =>
        Server.getAllServiceMonitoring($stateParams.productId),
      trafficInformations: /* @ngInject */ (
        $q,
        $stateParams,
        ServerOrderTrafficService,
        ServerTrafficService,
      ) =>
        $q.all({
          traffic: ServerTrafficService.getTraffic($stateParams.productId),
          trafficOption: ServerOrderTrafficService.getOption(
            $stateParams.productId,
          ),
          trafficOrderables: ServerOrderTrafficService.getOrderables(
            $stateParams.productId,
          ),
        }),
      vrackInfos: /* @ngInject */ ($stateParams, Server) =>
        Server.getVrackInfos($stateParams.productId),
    },
  });
};
