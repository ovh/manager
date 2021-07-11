import head from 'lodash/head';
import map from 'lodash/map';
import set from 'lodash/set';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.managedBaremetal.details.dashboard', {
    cache: false,
    views: {
      pccView: 'pccDashboard',
    },
    resolve: {
      deleteDrp: /* @ngInject */ ($state) => () =>
        $state.go('app.managedBaremetal.details.dashboard.deleteDrp'),
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
        $state.go('app.managedBaremetal.details.dashboard.update', {
          currentService,
          targetVersion,
        }),

      onAssociateIpBlock: /* @ngInject */ ($state) => () =>
        $state.go('app.managedBaremetal.details.dashboard.associate-ip-bloc'),

      onExecutionDateChange: /* @ngInject */ ($state, currentService) => () =>
        $state.go(
          'app.managedBaremetal.details.operation.execution-date-edit',
          {
            productId: currentService.serviceName,
            operationToEdit: currentService.vcenterUpgradePendingTask,
          },
        ),

      onMlSubscribe: /* @ngInject */ ($state) => () =>
        $state.go('app.managedBaremetal.details.dashboard.ml-subscribe'),

      onTerminate: /* @ngInject */ ($state, atInternet) => () => {
        atInternet.trackClick({
          name: 'dedicated::managedBaremetal::dashboard::terminate',
          type: 'action',
        });
        $state.go('app.managedBaremetal.details.dashboard.terminate');
      },

      onBasicOptionsUpgrade: /* @ngInject */ ($state) => (stateParams) =>
        $state.go(
          'app.managedBaremetal.details.servicePackUpgrade.basicOptions',
          stateParams,
        ),

      onCertificationUpgrade: /* @ngInject */ ($state) => (stateParams) =>
        $state.go(
          'app.managedBaremetal.details.servicePackUpgrade.certification',
          stateParams,
        ),

      onConfigurationOnlyUpgrade: /* @ngInject */ ($state) => (stateParams) =>
        $state.go(
          'app.managedBaremetal.details.servicePackUpgrade.configurationOnly',
          stateParams,
        ),

      orderSecurityOption: /* @ngInject */ ($state) => (optionName) =>
        $state.go('app.managedBaremetal.details.dashboard.security-options', {
          optionName,
        }),

      disableVmwareOption: /* @ngInject */ ($state) => (option) =>
        $state.go(
          'app.managedBaremetal.details.dashboard.vmware-option-disable',
          {
            option,
          },
        ),

      orderVmwareOption: /* @ngInject */ ($state) => (option) =>
        $state.go(
          'app.managedBaremetal.details.dashboard.vmware-option-order',
          {
            option,
          },
        ),

      goBack: /* @ngInject */ (goBackToDashboard) => goBackToDashboard,
      breadcrumb: () => null,
    },
  });
};
