import head from 'lodash/head';
import map from 'lodash/map';
import set from 'lodash/set';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedClouds.dashboard', {
    cache: false,
    views: {
      pccView: 'pccDashboard',
    },
    resolve: {
      deleteDrp: /* @ngInject */ ($state) => () =>
        $state.go('app.dedicatedClouds.dashboard.deleteDrp'),
      isMailingListSubscriptionAvailable: /* @ngInject */ (
        ovhFeatureFlipping,
      ) =>
        ovhFeatureFlipping
          .checkFeatureAvailability('dedicated-cloud:mailingListSubscription')
          .then((featureAvailability) =>
            featureAvailability.isFeatureAvailable(
              'dedicated-cloud:mailingListSubscription',
            ),
          ),
      vCenterUpgradeTask: /* @ngInject */ ($http, currentService) =>
        $http
          .get(`/dedicatedCloud/${currentService.serviceName}/task`, {
            params: {
              name: 'maintenanceUpgradeVcenter',
              state: 'todo',
            },
          })
          .then((response) =>
            map(response.data, (taskId) =>
              $http
                .get(
                  `/dedicatedCloud/${currentService.serviceName}/task/${taskId}`,
                )
                .then(({ data }) => data),
            ),
          )
          .then((tasks) =>
            set(currentService, 'vcenterUpgradePendingTask', head(tasks)),
          ),
      onUpgradeVersion: /* @ngInject */ ($state, currentService) => (
        targetVersion,
      ) =>
        $state.go('app.dedicatedClouds.dashboard.update', {
          currentService,
          targetVersion,
        }),

      onAssociateIpBlock: /* @ngInject */ ($state) => () =>
        $state.go('app.dedicatedClouds.dashboard.associate-ip-bloc'),

      onExecutionDateChange: /* @ngInject */ ($state, currentService) => () =>
        $state.go('app.dedicatedClouds.operation.execution-date-edit', {
          productId: currentService.serviceName,
          operationToEdit: currentService.vcenterUpgradePendingTask,
        }),

      onMlSubscribe: /* @ngInject */ ($state) => () =>
        $state.go('app.dedicatedClouds.dashboard.ml-subscribe'),

      onTerminate: /* @ngInject */ ($state) => () =>
        $state.go('app.dedicatedClouds.dashboard.terminate'),

      onBasicOptionsUpgrade: /* @ngInject */ ($state) => (stateParams) =>
        $state.go(
          'app.dedicatedClouds.servicePackUpgrade.basicOptions',
          stateParams,
        ),

      onCertificationUpgrade: /* @ngInject */ ($state) => (stateParams) =>
        $state.go(
          'app.dedicatedClouds.servicePackUpgrade.certification',
          stateParams,
        ),

      onConfigurationOnlyUpgrade: /* @ngInject */ ($state) => (stateParams) =>
        $state.go(
          'app.dedicatedClouds.servicePackUpgrade.configurationOnly',
          stateParams,
        ),

      orderSecurityOption: /* @ngInject */ ($state) => (optionName) =>
        $state.go('app.dedicatedClouds.dashboard.security-options', {
          optionName,
        }),

      disableVmwareOption: /* @ngInject */ ($state) => (option) =>
        $state.go('app.dedicatedClouds.dashboard.vmware-option-disable', {
          option,
        }),

      orderVmwareOption: /* @ngInject */ ($state) => (option) =>
        $state.go('app.dedicatedClouds.dashboard.vmware-option-order', {
          option,
        }),

      goBack: /* @ngInject */ (goBackToDashboard) => goBackToDashboard,
    },
  });
};
