import template from './disclaimer.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('exchange.dashboard.disclaimer', {
    url: '/disclaimer',
    controller: 'ExchangeDisclaimerCtrl',
    controllerAs: 'ctrlDisclaimer',
    template,
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('exchange_disclaimer'),
      ckEditor: () => import('ckeditor/ckeditor.js'),
    },
  });
};
