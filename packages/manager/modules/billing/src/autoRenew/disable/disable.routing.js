import filter from 'lodash/filter';

import { revertFailedBulkAction } from '../helpers/bulk-action-message.helper';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('billing.autorenew.disableRedirection', {
    url: '/disable?services',
    redirectTo: 'billing.autorenew.services.disable',
  });

  $stateProvider.state('billing.autorenew.services.disable', {
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
          currentUser.auth.account,
        ),
      /* @ngInject */
      updateRenew: ($q, BillingAutoRenew) => (services) =>
        BillingAutoRenew.updateServices(
          services.map((service) => {
            service.setManualRenew();
            return service;
          }),
        ).catch((error) => {
          revertFailedBulkAction(services, error?.messages, (service) => {
            service.setAutomaticRenew();
          });
          return $q.reject(error);
        }),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('billing_autorenew_disable_breadcrumb'),
    },
  });
};
