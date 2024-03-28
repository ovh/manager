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
      featureAvailability: /* @ngInject */ (ovhFeatureFlipping) =>
        ovhFeatureFlipping.checkFeatureAvailability([
          'dedicated-cloud:mailingListSubscription',
          'dedicated-cloud:leclercAndLeclercV2Migration',
        ]),
      isMailingListSubscriptionAvailable: /* @ngInject */ (
        featureAvailability,
      ) =>
        featureAvailability.isFeatureAvailable(
          'dedicated-cloud:mailingListSubscription',
        ),
      isLv1Lv2BannerAvailable: /* @ngInject */ (featureAvailability) =>
        featureAvailability.isFeatureAvailable(
          'dedicated-cloud:leclercAndLeclercV2Migration',
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

      associateIpBlockLink: /* @ngInject */ ($state) => () =>
        $state.href('app.managedBaremetal.details.dashboard.associate-ip-bloc'),

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

      onTerminate: /* @ngInject */ ($state) => () =>
        $state.go('app.managedBaremetal.details.dashboard.terminate'),

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
      goToVcdOrder: /* @ngInject */ ($state) => () =>
        $state.go('app.managedBaremetal.details.dashboard.vcd-order'),

      goBack: /* @ngInject */ (goBackToDashboard) => goBackToDashboard,
      breadcrumb: () => null,
    },
  });
};
