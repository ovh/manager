import includes from 'lodash/includes';
import isEmpty from 'lodash/isEmpty';

import UpgradeTask from './upgrade/upgrade-task.class';
import { ELIGIBLE_FOR_UPGRADE } from './dashboard.constants';
import { UPGRADE_MODE } from './upgrade/upgrade.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated-server.server.dashboard', {
    url: '',
    views: {
      'tabView@app.dedicated-server.server': {
        component: 'serverDashboard',
      },
    },
    resolve: {
      bandwidthInformations: /* @ngInject */ (
        $q,
        $stateParams,
        BandwidthVrackOrderService,
        Server,
        server,
      ) =>
        $q
          .all({
            bandwidth: Server.getBandwidth($stateParams.productId),
            bandwidthVrackOption: Server.getBandwidthVrackOption(
              $stateParams.productId,
            ),
            bandwidthVrackOrderOptions: BandwidthVrackOrderService.getOrderableBandwidths(
              server,
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
      currentActiveLink: /* @ngInject */ ($transition$, $state) => () =>
        $state.href($state.current.name, $transition$.params()),
      eligibleData: /* @ngInject */ (Server, user) => {
        const isEligible = includes(
          ELIGIBLE_FOR_UPGRADE.SUBSIDIARIES,
          user.ovhSubsidiary,
        );

        if (isEligible) {
          return Server.getUpgradeProductName(
            ELIGIBLE_FOR_UPGRADE.PLANCODE,
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
      goToCommit: /* @ngInject */ ($state, serverName, shellClient) =>
        shellClient.navigation
          .getURL(
            'dedicated',
            $state.href('app.dedicated-server.server.dashboard.commitment', {
              productId: serverName,
            }),
          )
          .then((url) => () => url),
      goToCancelCommit: /* @ngInject */ ($state, serverName, shellClient) =>
        shellClient.navigation
          .getURL(
            'dedicated',
            $state.href(
              'app.dedicated-server.server.dashboard.cancel-commitment',
              {
                productId: serverName,
              },
            ),
          )
          .then((url) => () => url),
      goToCancelResiliation: /* @ngInject */ (
        $state,
        serverName,
        shellClient,
      ) =>
        shellClient.navigation
          .getURL(
            'dedicated',
            $state.href(
              'app.dedicated-server.server.dashboard.cancel-resiliation',
              {
                productId: serverName,
              },
            ),
          )
          .then((url) => () => url),
      goToResiliation: /* @ngInject */ ($state, serverName, shellClient) =>
        shellClient.navigation
          .getURL(
            'dedicated',
            $state.href('app.dedicated-server.server.dashboard.resiliation', {
              productId: serverName,
            }),
          )
          .then((url) => () => url),
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
      goToMonitoringUpdate: /* @ngInject */ ($state, serverName) => () =>
        $state.go('app.dedicated-server.server.dashboard.monitoringUpdate', {
          productId: serverName,
        }),
      getOrderPrivateBandwidthLink: /* @ngInject */ (
        $state,
        isLegacy,
        serverName,
      ) => () =>
        isLegacy
          ? $state.href(
              'app.dedicated-server.server.dashboard.bandwidth-legacy-private-order',
              { productId: serverName },
            )
          : $state.href(
              'app.dedicated-server.server.dashboard.bandwidth-private-order',
              { productId: serverName },
            ),
      getOrderPublicBandwidthLink: /* @ngInject */ (
        $state,
        isLegacy,
        serverName,
      ) => () =>
        isLegacy
          ? $state.href(
              'app.dedicated-server.server.dashboard.bandwidth-legacy-public-order',
              { productId: serverName },
            )
          : $state.href(
              'app.dedicated-server.server.dashboard.bandwidth-public-order',
              { productId: serverName },
            ),
      goToUpdateReverseDns: /* @ngInject */ ($state, serverName) => () =>
        $state.go('app.dedicated-server.server.dashboard.update-reverse-dns', {
          productId: serverName,
        }),
      goToDeleteReverseDns: /* @ngInject */ ($state, serverName) => () =>
        $state.go('app.dedicated-server.server.dashboard.delete-reverse-dns', {
          productId: serverName,
        }),
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
      trafficInformation: /* @ngInject */ (
        $q,
        $stateParams,
        ServerOrderTrafficService,
        ServerTrafficService,
        server,
      ) =>
        $q.all({
          traffic: ServerTrafficService.getTraffic($stateParams.productId),
          trafficOption: ServerOrderTrafficService.getOption(
            $stateParams.productId,
          ),
          trafficOrderables: ServerOrderTrafficService.getOrderables(server),
        }),
      goToTrafficOrder: /* @ngInject */ ($state, serverName) => () =>
        $state.go('app.dedicated-server.server.dashboard.traffic-order', {
          productId: serverName,
        }),
      goToTrafficCancel: /* @ngInject */ ($state, serverName) => () =>
        $state.go('app.dedicated-server.server.dashboard.traffic-cancel', {
          productId: serverName,
        }),
      vrackInfos: /* @ngInject */ ($stateParams, Server) =>
        Server.getVrackInfos($stateParams.productId),
      breadcrumb: () => null,
      goToUpgrade: /* @ngInject */ ($state, upgradeTask) => (upgradeType) =>
        $state.go('app.dedicated-server.server.dashboard.upgrade', {
          upgradeType: upgradeTask ? UPGRADE_MODE.SCHEDULE : upgradeType,
        }),
      changeOwnerAvailable: /* @ngInject */ (features) =>
        features.isFeatureAvailable('dedicated-server:changeOwner'),
      isVmacUnavailableBannerAvailable: /* @ngInject */ (features) =>
        features.isFeatureAvailable('dedicated-server:vmac-unavailable-banner'),

      isMonitoringOptionsAvailable: /* @ngInject */ (ovhFeatureFlipping) => {
        const id = 'dedicated-server:monitoring-options';
        return ovhFeatureFlipping
          .checkFeatureAvailability([id])
          .then((orderAvailability) => orderAvailability.isFeatureAvailable(id))
          .catch(() => false);
      },

      upgradeTask: /* @ngInject */ ($http, $q, serverName) =>
        $http
          .get(
            `/dedicated/server/${serverName}/task?function=hardware_update&status=todo`,
          )
          .then(({ data: taskIds }) =>
            taskIds.length > 0
              ? $http
                  .get(`/dedicated/server/${serverName}/task/${taskIds[0]}`)
                  .then(({ data: task }) => {
                    return (task.plannedInterventionId
                      ? $http
                          .get(
                            `/dedicated/server/${serverName}/plannedIntervention/${task.plannedInterventionId}`,
                          )
                          .then(
                            ({ data: plannedIntervention }) =>
                              plannedIntervention,
                          )
                      : $q.when(null)
                    ).then((plannedIntervention) => {
                      return new UpgradeTask({
                        ...task,
                        plannedIntervention,
                      });
                    });
                  })
              : null,
          ),
    },
  });
};
