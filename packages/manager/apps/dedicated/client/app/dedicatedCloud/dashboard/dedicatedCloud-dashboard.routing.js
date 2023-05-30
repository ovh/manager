import head from 'lodash/head';
import map from 'lodash/map';
import set from 'lodash/set';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedCloud.details.dashboard', {
    url: '',
    cache: false,
    views: {
      pccView: 'pccDashboard',
    },
    resolve: {
      deleteDrp: /* @ngInject */ ($state) => () =>
        $state.go('app.dedicatedCloud.details.dashboard.deleteDrp'),
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
        $state.go('app.dedicatedCloud.details.dashboard.update', {
          currentService,
          targetVersion,
        }),

      associateIpBlockLink: /* @ngInject */ ($state) => () =>
        $state.href('app.dedicatedCloud.details.dashboard.associate-ip-bloc'),

      onExecutionDateChange: /* @ngInject */ ($state, currentService) => () =>
        $state.go('app.dedicatedCloud.details.operation.execution-date-edit', {
          productId: currentService.serviceName,
          operationToEdit: currentService.vcenterUpgradePendingTask,
        }),

      onMlSubscribe: /* @ngInject */ ($state) => () =>
        $state.go('app.dedicatedCloud.details.dashboard.ml-subscribe'),

      onTerminate: /* @ngInject */ ($state) => () =>
        $state.go('app.dedicatedCloud.details.dashboard.terminate'),

      onBasicOptionsUpgrade: /* @ngInject */ ($state) => (stateParams) =>
        $state.go(
          'app.dedicatedCloud.details.servicePackUpgrade.basicOptions',
          stateParams,
        ),

      onCertificationUpgrade: /* @ngInject */ ($state) => (stateParams) =>
        $state.go(
          'app.dedicatedCloud.details.servicePackUpgrade.certification',
          stateParams,
        ),

      onConfigurationOnlyUpgrade: /* @ngInject */ ($state) => (stateParams) =>
        $state.go(
          'app.dedicatedCloud.details.servicePackUpgrade.configurationOnly',
          stateParams,
        ),

      orderSecurityOption: /* @ngInject */ ($state) => (optionName) =>
        $state.go('app.dedicatedCloud.details.dashboard.security-options', {
          optionName,
        }),

      disableVmwareOption: /* @ngInject */ ($state) => (option) =>
        $state.go(
          'app.dedicatedCloud.details.dashboard.vmware-option-disable',
          {
            option,
          },
        ),

      orderVmwareOption: /* @ngInject */ ($state) => (option) =>
        $state.go('app.dedicatedCloud.details.dashboard.vmware-option-order', {
          option,
        }),

      goBack: /* @ngInject */ (goBackToDashboard) => goBackToDashboard,
      breadcrumb: () => null,
    },
  });
};
