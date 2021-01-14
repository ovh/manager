import kebabCase from 'lodash/kebabCase';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.billing.autorenew.service.commitment', {
    url: '/commitment?duration',
    component: 'billingCommitment',
    resolve: {
      goBack: /* @ngInject */ (goToAutorenew) => goToAutorenew,
      duration: /* @ngInject */ ($transition$) =>
        $transition$.params().duration,
      me: /* @ngInject */ (currentUser) => currentUser,
      trackingPrefix: /* @ngInject */ (service) =>
        `account::billing::autorenew::${kebabCase(service.serviceType)}`,
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('billing_autorenew_commitment'),
    },
    onEnter: /* @ngInject */ (atInternet, service) =>
      atInternet.trackPage({
        name: `account::billing::autorenew::${kebabCase(
          service.serviceType,
        )}::commit`,
        type: 'navigation',
      }),
    atInternet: {
      ignore: true,
    },
  });
};
