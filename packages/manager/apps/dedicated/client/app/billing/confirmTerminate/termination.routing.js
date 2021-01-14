import controller from './legacy/termination-legacy.controller';
import template from './legacy/termination-legacy.html';

export default /* @ngInject */ ($stateProvider, coreConfigProvider) => {
  if (coreConfigProvider.isRegion('US')) {
    $stateProvider.state('app.account.billing.confirmTerminate', {
      url: '/confirmTerminate?id&token',
      template,
      controller,
      controllerAs: 'TerminateServiceCtrl',
      translations: { value: ['./legacy', '../autoRenew'], format: 'json' },
      resolve: {
        hideBreadcrumb: () => true,
      },
    });
  } else {
    $stateProvider.state('app.account.billing.confirmTerminate', {
      url: '/confirmTerminate?id&token',
      component: 'billingConfirmTermination',
      resolve: {
        confirmTermination: /* @ngInject */ (
          BillingTerminate,
          service,
          token,
        ) => () => BillingTerminate.confirmTermination(service, token),
        questions: /* @ngInject */ (BillingTerminate, serviceId) =>
          BillingTerminate.getTerminationForm(serviceId).then(
            ({ questions }) => questions,
          ),
        service: /* @ngInject */ (BillingTerminate, serviceId) =>
          BillingTerminate.getServiceApi(serviceId),
        serviceId: /* @ngInject */ ($transition$) => $transition$.params().id,
        token: /* @ngInject */ ($transition$) => $transition$.params().token,
        user: /* @ngInject */ (currentUser) => currentUser,
        hideBreadcrumb: () => true,
      },
    });
  }
};
