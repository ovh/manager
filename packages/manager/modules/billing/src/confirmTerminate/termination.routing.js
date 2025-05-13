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
      redirectTo: (transition) => {
        const injector = transition.injector();
        return injector
          .getAsync('hasAgoraTermination')
          .then((hasAgoraTermination) => {
            return hasAgoraTermination
              ? 'app.account.billing.confirmTerminateAgora'
              : false;
          });
      },
      resolve: {
        planCode: /* @ngInject */ (BillingTerminate, $transition$) =>
          BillingTerminate.getServiceApi($transition$.params().id).then(
            (service) => service.billing.plan.code,
          ),
        hasAgoraTermination: /* @ngInject */ (BillingTerminate, planCode) =>
          BillingTerminate.constructor.hasAgoraTermination(planCode),
        hideBreadcrumb: () => true,
      },
    });

    // temporary state to enable agora resiliation on US side
    $stateProvider.state('app.account.billing.confirmTerminateAgora', {
      url: '/confirm-terminate?id&token',
      component: 'billingConfirmTermination',
      redirectTo: (transition) => {
        const injector = transition.injector();
        return injector
          .getAsync('hasAgoraTermination')
          .then((hasAgoraTermination) => {
            return !hasAgoraTermination
              ? 'app.account.billing.confirmTerminate'
              : false;
          });
      },
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
        planCode: /* @ngInject */ (service) => service.billing.plan.code,
        serviceId: /* @ngInject */ ($transition$) => $transition$.params().id,
        token: /* @ngInject */ ($transition$) => $transition$.params().token,
        user: /* @ngInject */ (currentUser) => currentUser,
        hasAgoraTermination: /* @ngInject */ (BillingTerminate, planCode) =>
          BillingTerminate.constructor.hasAgoraTermination(planCode),
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
