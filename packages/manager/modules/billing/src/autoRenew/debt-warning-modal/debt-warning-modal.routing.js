export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('billing.autorenew.debt-warning-modal', {
    url: '/debt-warning',
    redirectTo: 'billing.autorenew.services.debt-warning-modal',
  });

  $stateProvider.state('billing.autorenew.services.debt-warning-modal', {
    url: '/debt-warning',
    views: {
      modal: {
        component: 'debtWarningModal',
      },
    },
    layout: 'modal',
    resolve: {
      debtLink: /* @ngInject */ (coreURLBuilder) =>
        coreURLBuilder.buildURL('billing', '#/history/debt/all/pay'),
      goBack: /* @ngInject */ (goToAutorenew) => goToAutorenew,
      hideBreadcrumb: () => true,
    },
    atInternet: {
      ignore: true,
    },
  });
};
