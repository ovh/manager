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
    },
  });
};
