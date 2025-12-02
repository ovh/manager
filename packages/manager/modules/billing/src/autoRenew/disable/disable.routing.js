import filter from 'lodash/filter';
import { SERVICE_RENEW_MODES } from '../autorenew.constants';
import { mapErrorsForBulkActions } from '../helpers/bulk-action-message.helper';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('billing.autorenew.disableRedirection', {
    url: '/disable?services',
    redirectTo: 'billing.autorenew.services.disable',
  });

  $stateProvider.state('billing.autorenew.services.disable', {
    url: '/disable?services',
    component: 'billingAutorenewDisable',
    resolve: {
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
      updateRenew: ($q, BillingAutoRenew) => (services) => {
        const updateRenewModePromises = services.map((service) =>
          BillingAutoRenew.updateRenewMode(
            service.id,
            SERVICE_RENEW_MODES.MANUAL,
          ),
        );

        return $q
          .all(updateRenewModePromises)
          .then((results) => mapErrorsForBulkActions(results));
      },
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('billing_autorenew_disable_breadcrumb'),
    },
  });
};
