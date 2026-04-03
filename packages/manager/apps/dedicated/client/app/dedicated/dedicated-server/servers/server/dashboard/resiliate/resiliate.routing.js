import { BillingService as Service } from '@ovh-ux/manager-models';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated-server.server.dashboard.resiliate', {
    url: '/resiliate',
    views: {
      modal: {
        component: 'ovhManagerBillingResiliateModal',
      },
    },
    layout: 'modal',
    resolve: {
      serviceId: /* @ngInject */ (serviceInfos) => serviceInfos.serviceId,
      service: /* @ngInject */ ($http, coreConfig, serviceId) =>
        $http
          .get(`/services/${serviceId}`)
          .then(({ data }) => new Service(data, coreConfig.getUserLocale())),
      capabilities: /* @ngInject */ (service) => {
        const actions =
          service?.billing?.lifecycle?.capacities?.actions ||
          service?.billing?.lifecycle?.current?.pendingActions ||
          [];
        return actions;
      },
      serviceTypeLabel: () => 'DEDICATED_SERVER',
      goBack: /* @ngInject */ (goToDashboard) => () => goToDashboard(),
      onSuccess: /* @ngInject */ ($state, Alerter) => (
        reload,
        successMessage,
      ) => {
        const promise = $state.go('app.dedicated-server', {}, { reload: true });
        if (successMessage) {
          promise.then(() => {
            Alerter.set('alert-success', successMessage, null, 'server_alert');
          });
        }
        return promise;
      },
      onError: /* @ngInject */ (Alerter, goToDashboard) => (errorMessage) => {
        Alerter.set(
          'alert-danger',
          errorMessage,
          null,
          'server_dashboard_alert',
        );
        return goToDashboard();
      },
    },
  });
};
