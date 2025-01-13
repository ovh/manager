import { SERVICE_TYPE } from './constant';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nutanix.dashboard.general-info.resiliate', {
    url: '/resiliate',
    views: {
      modal: {
        component: 'billingAutorenewTerminateAgoraService',
      },
    },
    params: {
      serviceName: null,
    },
    layout: 'modal',
    resolve: {
      serviceType: () => SERVICE_TYPE,
      id: /* @ngInject */ (serviceInfo) => serviceInfo.serviceId,
      goBack: /* @ngInject */ ($state, $timeout, Alerter, serviceName) => (
        message,
        type,
      ) => {
        const promise = $state.go('nutanix.dashboard.general-info', {
          serviceName,
        });

        if (message) {
          promise.then(() =>
            $timeout(() =>
              Alerter.set(
                `alert-${type}`,
                message,
                null,
                'nutanix-dashboard-alert',
              ),
            ),
          );
        }

        return promise;
      },
    },
  });
};
