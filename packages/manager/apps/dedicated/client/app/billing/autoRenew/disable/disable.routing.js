import filter from 'lodash/filter';
import map from 'lodash/map';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.billing.autorenew.disable', {
    url: '/disable?services',
    component: 'billingAutorenewDisable',
    resolve: {
      goBack: /* @ngInject */ (goToAutorenew) => goToAutorenew,
      servicesId: /* @ngInject */ ($transition$) =>
        $transition$.params().services.split(','),
      servicesList: /* @ngInject */ (
        BillingAutorenewDisable,
        billingServices,
        currentUser,
        servicesId,
      ) =>
        BillingAutorenewDisable.constructor.groupByManualRenewCapabilities(
          filter(billingServices, (service) =>
            servicesId.includes(service.id.toString()),
          ),
          currentUser.nichandle,
        ),
      /* @ngInject */
      updateRenew: (BillingAutoRenew) => (services) =>
        BillingAutoRenew.updateServices(
          map(services, (service) => {
            service.setManualRenew();
            return service;
          }),
        ),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('billing_autorenew_disable_breadcrumb'),
    },
  });
};
