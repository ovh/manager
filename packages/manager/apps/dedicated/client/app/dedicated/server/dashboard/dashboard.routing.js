import includes from 'lodash/includes';
import isEmpty from 'lodash/isEmpty';

import { ELIGIBLE_FOR_UPGRADE } from './dashboard.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated-server.server.dashboard', {
    url: '',
    views: {
      'tabView@app.dedicated-server.server': {
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
      isCommitmentAvailable: /* @ngInject */ (ovhFeatureFlipping) =>
        ovhFeatureFlipping
          .checkFeatureAvailability(['billing:commitment'])
          .then((commitmentAvailability) =>
            commitmentAvailability.isFeatureAvailable('billing:commitment'),
          )
          .catch(() => false),
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
      goToDashboard: /* @ngInject */ ($state, Alerter, serverName) => (
        message = false,
        type = 'DONE',
      ) => {
        const reload = message && type === 'DONE';
        const promise = $state.go(
          'app.dedicated-server.server.dashboard',
          {
            productId: serverName,
          },
          {
            reload,
          },
        );

        if (message) {
          promise.then(() => {
            Alerter.alertFromSWS(
              message,
              type,
              message.id || 'server_dashboard_alert',
            );
          });
        }

        return promise;
      },
      goToNameEdit: /* @ngInject */ ($state, serverName) => () =>
        $state.go('app.dedicated-server.server.dashboard.edit-display-name', {
          productId: serverName,
        }),
      goToCommit: /* @ngInject */ ($state, serverName) => () =>
        $state.href('app.dedicated-server.server.dashboard.commitment', {
          productId: serverName,
        }),
      goToCancelCommit: /* @ngInject */ ($state, serverName) => () =>
        $state.href('app.dedicated-server.server.dashboard.cancel-commitment', {
          productId: serverName,
        }),
      goToCancelResiliation: /* @ngInject */ ($state, serverName) => () =>
        $state.href(
          'app.dedicated-server.server.dashboard.cancel-resiliation',
          {
            productId: serverName,
          },
        ),
      goToResiliation: /* @ngInject */ ($state, serverName) => () =>
        $state.href('app.dedicated-server.server.dashboard.resiliation', {
          productId: serverName,
        }),
      goToSgxIntroduction: /* @ngInject */ ($state, atInternet) => () => {
        atInternet.trackClick({
          name: 'dedicated::dedicated::server::dashboard::sgx::manage',
          type: 'action',
        });

        return $state.go(
          'app.dedicated-server.server.dashboard.sgx.introduction',
        );
      },
      goToSgxManage: /* @ngInject */ ($state, atInternet) => () => {
        atInternet.trackClick({
          name: 'dedicated::dedicated::server::dashboard::sgx::manage',
          type: 'action',
        });

        return $state.go('app.dedicated-server.server.dashboard.sgx.manage');
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
              'app.dedicated-server.server.dashboard.bandwidth-legacy-private-order',
              { productId: serverName },
            )
          : $state.href(
              'app.dedicated-server.server.dashboard.bandwidth-private-order',
              { productId: serverName },
            ),
      orderPublicBandwidthLink: /* @ngInject */ (
        $state,
        isLegacy,
        serverName,
      ) =>
        isLegacy
          ? $state.href(
              'app.dedicated-server.server.dashboard.bandwidth-legacy-public-order',
              { productId: serverName },
            )
          : $state.href(
              'app.dedicated-server.server.dashboard.bandwidth-public-order',
              { productId: serverName },
            ),
      serviceMonitoring: /* @ngInject */ ($transition$, Server) =>
        Server.getAllServiceMonitoring($transition$.params().productId),
      technicalDetails: /* @ngInject */ ($http, serverName) =>
        $http
          .get(`/dedicated/technical-details/${serverName}`, {
            serviceType: 'aapi',
          })
          .then(({ data }) =>
            data?.baremetalServers?.storage ? data?.baremetalServers : null,
          )
          .catch(() => null),
      terminateLink: /* @ngInject */ ($state, serverName) =>
        $state.href('app.dedicated-server.server.dashboard.terminate', {
          productId: serverName,
        }),
      trackingPrefix: () => 'dedicated::server::dashboard',
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
      breadcrumb: () => null,
      goToManualUpgrade: /* @ngInject */ ($state) => (selectedUpgrade) =>
        $state.go('app.dedicated-server.server.dashboard.upgrade', {
          selectedUpgrade,
        }),
    },
  });
};
