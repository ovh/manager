import includes from 'lodash/includes';
import isEmpty from 'lodash/isEmpty';

import UpgradeTask from './upgrade/upgrade-task.class';
import { ELIGIBLE_FOR_UPGRADE } from './dashboard.constants';
import { UPGRADE_MODE } from './upgrade/upgrade.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated-cluster.cluster.node.dashboard', {
    url: '',
    views: {
      'tabView@app.dedicated-cluster.cluster.node': {
        component: 'serverDashboard',
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
      currentActiveLink: /* @ngInject */ ($transition$, $state) => () =>
        $state.href($state.current.name, $transition$.params()),
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
          'app.dedicated-cluster.cluster.node.dashboard',
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
        $state.go(
          'app.dedicated-cluster.cluster.node.dashboard.edit-display-name',
          {
            productId: serverName,
          },
        ),
      goToCommit: /* @ngInject */ (
        $state,
        serverName,
        clusterId,
        shellClient,
      ) =>
        shellClient.navigation
          .getURL(
            'dedicated',
            $state.href(
              'app.dedicated-cluster.cluster.node.dashboard.commitment',
              {
                clusterId,
                productId: serverName,
              },
            ),
          )
          .then((url) => () => url),
      goToCancelCommit: /* @ngInject */ (
        $state,
        serverName,
        clusterId,
        shellClient,
      ) =>
        shellClient.navigation
          .getURL(
            'dedicated',
            $state.href(
              'app.dedicated-cluster.cluster.node.dashboard.cancel-commitment',
              {
                clusterId,
                productId: serverName,
              },
            ),
          )
          .then((url) => () => url),
      goToCancelResiliation: /* @ngInject */ (
        $state,
        serverName,
        clusterId,
        shellClient,
      ) =>
        shellClient.navigation
          .getURL(
            'dedicated',
            $state.href(
              'app.dedicated-cluster.cluster.node.dashboard.cancel-resiliation',
              {
                clusterId,
                productId: serverName,
              },
            ),
          )
          .then((url) => () => url),
      goToResiliation: /* @ngInject */ (
        $state,
        serverName,
        clusterId,
        shellClient,
      ) =>
        shellClient.navigation
          .getURL(
            'dedicated',
            $state.href(
              'app.dedicated-cluster.cluster.node.dashboard.resiliation',
              {
                clusterId,
                productId: serverName,
              },
            ),
          )
          .then((url) => () => url),
      goToSgxIntroduction: /* @ngInject */ ($state, atInternet) => () => {
        atInternet.trackClick({
          name: 'dedicated::dedicated::node::dashboard::sgx::manage',
          type: 'action',
        });

        return $state.go(
          'app.dedicated-cluster.cluster.node.dashboard.sgx.introduction',
        );
      },
      goToSgxManage: /* @ngInject */ ($state, atInternet) => () => {
        atInternet.trackClick({
          name: 'dedicated::dedicated::node::dashboard::sgx::manage',
          type: 'action',
        });

        return $state.go(
          'app.dedicated-cluster.cluster.node.dashboard.sgx.manage',
        );
      },
      goToMonitoringUpdate: /* @ngInject */ ($state, serverName) => () =>
        $state.go(
          'app.dedicated-cluster.cluster.node.dashboard.monitoringUpdate',
          {
            productId: serverName,
          },
        ),
      goToTagsModal: /* @ngInject */ ($state, serverName, clusterId) => () =>
        $state.go(
          'app.dedicated-cluster.cluster.node.dashboard.tags-list-modal',
          {
            clusterId,
            productId: serverName,
          },
        ),
      goToTagManager: /* @ngInject */ ($state, serverName) => (reload) => {
        return $state.go(
          'app.dedicated-cluster.cluster.node.dashboard.tag-manager',
          {
            productId: serverName,
          },
          { reload },
        );
      },
      getOrderPrivateBandwidthLink: /* @ngInject */ (
        $state,
        serverName,
      ) => () =>
        $state.href(
          'app.dedicated-cluster.cluster.node.dashboard.bandwidth-private-order',
          { productId: serverName },
        ),
      getOrderPublicBandwidthLink: /* @ngInject */ ($state, serverName) => () =>
        $state.href(
          'app.dedicated-cluster.cluster.node.dashboard.bandwidth-public-order',
          { productId: serverName },
        ),
      goToUpdateReverseDns: /* @ngInject */ ($state, serverName) => () =>
        $state.go(
          'app.dedicated-cluster.cluster.node.dashboard.update-reverse-dns',
          {
            productId: serverName,
          },
        ),
      goToDeleteReverseDns: /* @ngInject */ ($state, serverName) => () =>
        $state.go(
          'app.dedicated-cluster.cluster.node.dashboard.delete-reverse-dns',
          {
            productId: serverName,
          },
        ),
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
        $state.href('app.dedicated-cluster.cluster.node.dashboard.terminate', {
          productId: serverName,
        }),
      trackingPrefix: () => 'dedicated::node::dashboard',
      trackingSubscriptionPrefix: () =>
        'DedicatedServers::dedicated-server::server',
      trackingPage: () =>
        'DedicatedServers::dedicated-server::server::server::dashboard::general-information',
      trackingNameSuffix: () => 'server',
      trafficInformation: /* @ngInject */ (
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
      goToTrafficOrder: /* @ngInject */ ($state, serverName) => () =>
        $state.go(
          'app.dedicated-cluster.cluster.node.dashboard.traffic-order',
          {
            productId: serverName,
          },
        ),
      goToTrafficCancel: /* @ngInject */ ($state, serverName) => () =>
        $state.go(
          'app.dedicated-cluster.cluster.node.dashboard.traffic-cancel',
          {
            productId: serverName,
          },
        ),
      vrackInfos: /* @ngInject */ ($stateParams, Server) =>
        Server.getVrackInfos($stateParams.productId),
      breadcrumb: () => null,
      goToUpgrade: /* @ngInject */ ($state, upgradeTask) => (upgradeType) =>
        $state.go('app.dedicated-cluster.cluster.node.dashboard.upgrade', {
          upgradeType: upgradeTask ? UPGRADE_MODE.SCHEDULE : upgradeType,
        }),
      changeOwnerAvailable: /* @ngInject */ (features) =>
        features.isFeatureAvailable('dedicated-server:changeOwner'),

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
