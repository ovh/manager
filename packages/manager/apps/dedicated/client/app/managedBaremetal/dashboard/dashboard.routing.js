import head from 'lodash/head';
import map from 'lodash/map';
import set from 'lodash/set';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.managedBaremetal.dashboard', {
    cache: false,
    views: {
      pccView: 'pccDashboard',
    },
    resolve: {
      deleteDrp: /* @ngInject */ ($state) => () =>
        $state.go('app.managedBaremetal.dashboard.deleteDrp'),
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
          .then((response) => {
            return map(response.data, (taskId) => {
              return $http
                .get(
                  `/dedicatedCloud/${currentService.serviceName}/task/${taskId}`,
                )
                .then((taskResponse) => taskResponse.data);
            });
          })
          .then((tasks) => {
            return set(
              currentService,
              'vcenterUpgradePendingTask',
              head(tasks),
            );
          }),
      onUpgradeVersion: /* @ngInject */ ($state, currentService) => (
        targetVersion,
      ) =>
        $state.go('app.managedBaremetal.dashboard.update', {
          currentService,
          targetVersion,
        }),

      onAssociateIpBlock: /* @ngInject */ ($state) => () =>
        $state.go('app.managedBaremetal.dashboard.associate-ip-bloc'),

      onExecutionDateChange: /* @ngInject */ ($state, currentService) => () =>
        $state.go('app.managedBaremetal.operation.execution-date-edit', {
          productId: currentService.serviceName,
          operationToEdit: currentService.vcenterUpgradePendingTask,
        }),

      onMlSubscribe: /* @ngInject */ ($state) => () =>
        $state.go('app.managedBaremetal.dashboard.ml-subscribe'),

      onTerminate: /* @ngInject */ ($state) => () =>
        $state.go('app.managedBaremetal.dashboard.terminate'),

      onBasicOptionsUpgrade: /* @ngInject */ ($state) => (stateParams) =>
        $state.go(
          'app.managedBaremetal.servicePackUpgrade.basicOptions',
          stateParams,
        ),

      onCertificationUpgrade: /* @ngInject */ ($state) => (stateParams) =>
        $state.go(
          'app.managedBaremetal.servicePackUpgrade.certification',
          stateParams,
        ),

      onConfigurationOnlyUpgrade: /* @ngInject */ ($state) => (stateParams) =>
        $state.go(
          'app.managedBaremetal.servicePackUpgrade.configurationOnly',
          stateParams,
        ),

      orderSecurityOption: /* @ngInject */ ($state) => (optionName) =>
        $state.go('app.managedBaremetal.dashboard.security-options', {
          optionName,
        }),

      disableVmwareOption: /* @ngInject */ ($state) => (option) =>
        $state.go('app.managedBaremetal.dashboard.vmware-option-disable', {
          option,
        }),

      orderVmwareOption: /* @ngInject */ ($state) => (option) =>
        $state.go('app.managedBaremetal.dashboard.vmware-option-order', {
          option,
        }),

      goBack: /* @ngInject */ (goBackToDashboard) => goBackToDashboard,
    },
  });
};
