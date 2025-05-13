import kebabCase from 'lodash/kebabCase';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.account.billing.autorenew.service.cancel-commitment',
    {
      url: '/cancel-commitment',
      views: {
        modal: {
          component: 'billingCancelCommitment',
        },
      },
      layout: 'modal',
      atInternet: {
        ignore: true,
      },
      onEnter: /* @ngInject */ (atInternet, service) =>
        atInternet.trackPage({
          name: `account::billing::autorenew::${kebabCase(
            service.serviceType,
          )}::cancel-commitment`,
          type: 'navigation',
        }),
      resolve: {
        goBack: /* @ngInject */ (goToAutorenew) => goToAutorenew,
        breadcrumb: () => null,
        service: /* @ngInject */ (BillingAutoRenew, serviceId) =>
          BillingAutoRenew.findService({ serviceId }),
        confirmCancelTracking: /* @ngInject */ (service) =>
          `dedicated::account::billing::${kebabCase(
            service.serviceType,
          )}::cancel-commitment::confirm`,
      },
    },
  );
};
