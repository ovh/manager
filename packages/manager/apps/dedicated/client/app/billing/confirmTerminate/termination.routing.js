export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.billing.confirmTerminate', {
    url: '/confirmTerminate?id&token',
    component: 'billingConfirmTermination',
    translations: { value: ['..'], format: 'json' },
    resolve: {
      questions: /* @ngInject */ (BillingTerminate, serviceId) =>
        BillingTerminate.getTerminationForm(serviceId).then(
          ({ questions }) => questions,
        ),
      service: /* @ngInject */ (BillingTerminate, serviceId) =>
        BillingTerminate.getServiceApi(serviceId),
      serviceId: /* @ngInject */ ($transition$) => $transition$.params().id,
      token: /* @ngInject */ ($transition$) => $transition$.params().token,
      user: /* @ngInject */ (currentUser) => currentUser,
    },
  });
};
