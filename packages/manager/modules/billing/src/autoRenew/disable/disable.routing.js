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
      // This might not work if you try to access the url directly: since we rely on the billingServices (fetched on services route) if the ids we pass here are not present in billingServices we'll have an empty servicesList
      // We probably should request /services using iceberg to fetch services, however the result from the API is currently not compatible with the BillingService model we're expecting the services to be.
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
