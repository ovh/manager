import get from 'lodash/get';
import sortBy from 'lodash/sortBy';

import DedicatedCloudInfo from './dedicatedCloud.class';

angular.module('App').config(
  /* @ngInject */ ($stateProvider, $urlServiceProvider) => {
    $stateProvider.state('app.dedicatedClouds', {
      redirectTo: 'app.dedicatedClouds.dashboard',
      resolve: {
        currentService: /* @ngInject */ ($transition$, DedicatedCloud) =>
          DedicatedCloud.getSelected(
            $transition$.params().productId,
            true,
          ).then(
            (dedicatedCloudData) => new DedicatedCloudInfo(dedicatedCloudData),
          ),
        currentDrp: /* @ngInject */ (
          $transition$,
          dedicatedCloudDrp,
          DEDICATEDCLOUD_DATACENTER_DRP_STATUS,
          DEDICATEDCLOUD_DATACENTER_DRP_VPN_CONFIGURATION_STATUS,
        ) =>
          dedicatedCloudDrp
            .getPccDrpPlan($transition$.params().productId)
            .then((states) => {
              const existingPlan = states.find(
                ({ state }) =>
                  state !== DEDICATEDCLOUD_DATACENTER_DRP_STATUS.disabled,
              );

              // If no plan with state other than disabled, let's return the first datacenter plan
              const currentDrp =
                existingPlan || sortBy(states, 'datacenterId')[0];

              const drpVpnStatus = get(
                currentDrp,
                'remoteSiteInformation.vpnConfigState',
              );
              currentDrp.vpnStatus = drpVpnStatus;
              currentDrp.isWaitingVpnConfiguration =
                drpVpnStatus != null &&
                drpVpnStatus !==
                  DEDICATEDCLOUD_DATACENTER_DRP_VPN_CONFIGURATION_STATUS.configured;

              currentDrp.state = dedicatedCloudDrp.constructor.formatStatus(
                currentDrp.state,
              );

              return dedicatedCloudDrp
                .getDisableSuccessAlertPreference(
                  $transition$.params().productId,
                )
                .then((alertPreferenceValue) => {
                  currentDrp.isSuccessAlertDisable = alertPreferenceValue;
                })
                .catch(() => {
                  currentDrp.isSuccessAlertDisable = true;
                })
                .then(() => currentDrp);
            }),
        datacenterList: /* @ngInject */ ($stateParams, DedicatedCloud) =>
          DedicatedCloud.getDatacenters($stateParams.productId).then(
            ({ results }) => results,
          ),

        drpGlobalStatus: /* @ngInject */ (currentDrp, dedicatedCloudDrp) => ({
          error:
            dedicatedCloudDrp.constructor.isDrpNotInValidState(
              currentDrp.state,
            ) ||
            dedicatedCloudDrp.constructor.isDrpNotInValidState(
              currentDrp.vpnStatus,
            ),
          warning:
            dedicatedCloudDrp.constructor.isDrpInChangingState(
              currentDrp.state,
            ) ||
            dedicatedCloudDrp.constructor.isDrpInChangingState(
              currentDrp.vpnStatus,
            ),
          success: dedicatedCloudDrp.constructor.isDrpInValidState(
            currentDrp.state,
          ),
        }),
        isDrpActionPossible: /* @ngInject */ (currentDrp, dedicatedCloudDrp) =>
          dedicatedCloudDrp.constructor.isDrpActionPossible(currentDrp),

        goToDrp: /* @ngInject */ ($state, currentDrp) => (datacenterId) =>
          $state.go('app.dedicatedClouds.datacenter.drp', {
            datacenterId,
            drpInformations: currentDrp,
          }),
        goToDrpDatacenterSelection: /* @ngInject */ ($state) => () =>
          $state.go('app.dedicatedClouds.drpDatacenterSelection'),
        goToPccDashboard: /* @ngInject */ ($state) => (reload = false) =>
          $state.go('app.dedicatedClouds', {}, { reload }),
        goToVpnConfiguration: /* @ngInject */ ($state, currentDrp) => () =>
          $state.go('app.dedicatedClouds.datacenter.drp.summary', {
            datacenterId: currentDrp.datacenterId,
            drpInformations: currentDrp,
          }),
        serviceName: /* @ngInject */ ($transition$) =>
          $transition$.params().productId,
        goBackToDashboard: /* @ngInject */ (
          $state,
          $timeout,
          Alerter,
          currentService,
        ) => (message = false, type = 'success') => {
          const reload = message && type === 'success';

          const promise = $state.go(
            'app.dedicatedClouds.dashboard',
            { productId: currentService.serviceName },
            {
              reload,
            },
          );

          if (message) {
            promise.then(() =>
              $timeout(() => Alerter.set(`alert-${type}`, message, null)),
            );
          }

          return promise;
        },
        operationsUrl: /* @ngInject */ ($state, currentService) =>
          $state.href('app.dedicatedClouds.operation', {
            productId: currentService.serviceName,
          }),
      },
      url: '/configuration/dedicated_cloud/:productId',
      views: {
        '': {
          templateUrl: 'dedicatedCloud/dedicatedCloud.html',
          controller: 'DedicatedCloudCtrl',
          controllerAs: '$ctrl',
        },
      },
      reloadOnSearch: false,
      translations: { value: ['.'], format: 'json' },
    });

    // ensure compatibility with links sended by emails
    // like #/configuration/dedicated_cloud/pcc-123456?action=confirmcancel&token=myToken
    // make a redirect to the new url of ui route
    $urlServiceProvider.rules.when(
      '/configuration/dedicated_cloud/:productId?action&token',
      (match) => {
        if (match.action === 'confirmcancel') {
          return `/configuration/dedicated_cloud/${match.productId}/terminate-confirm?token=${match.token}`;
        }

        return false;
      },
    );
  },
);
