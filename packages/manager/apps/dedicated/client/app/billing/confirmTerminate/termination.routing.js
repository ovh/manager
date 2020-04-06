import template from './billing-confirmTerminate.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.billing.confirmTerminate', {
    url: '/confirmTerminate?id&token',
    template,
    controller: 'Billing.controllers.TerminateServiceCtrl',
    controllerAs: 'TerminateServiceCtrl',
    translations: { value: ['..'], format: 'json' },
  });
};
