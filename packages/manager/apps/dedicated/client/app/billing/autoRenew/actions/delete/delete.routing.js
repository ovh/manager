import kebabCase from 'lodash/kebabCase';
import { BillingService } from '@ovh-ux/manager-models';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.billing.autorenew.delete', {
    url: '/delete?serviceId&serviceType',
    componentProvider: /* @ngInject */ (engagement) =>
      engagement ? 'billingAutorenewDelete' : 'billingConfirmTermination',
    resolve: {
      cancelResiliationUrl: /* @ngInject */ ($state, serviceId) =>
        $state.href('app.account.billing.autorenew.cancelResiliation', {
          serviceId,
        }),
      engagement: /* @ngInject */ ($http, service) =>
        (service.canHaveEngagement()
          ? $http
              .get(`/services/${service.id}/billing/engagement`)
              .then((data) => ({ engagement: data }))
              .catch(() => ({ engagement: null }))
          : Promise.resolve({ engagement: null })
        ).then(({ engagement }) => engagement),

      goBack: /* @ngInject */ (
        $translate,
        cancelResiliationUrl,
        goToAutorenew,
      ) => (success = false) =>
        success
          ? goToAutorenew(
              `${$translate.instant('autorenew_service_delete_success')}
      <a data-href="${cancelResiliationUrl}" data-translate="autorenew_service_delete_cancel"></a>`,
            )
          : goToAutorenew(),
      serviceId: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceId,
      serviceType: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceType,
      service: /* @ngInject */ (BillingAutoRenew, serviceId, serviceType) =>
        BillingAutoRenew.getService(serviceId, serviceType).then(
          (service) =>
            new BillingService({
              ...service,
              serviceId: service.id,
            }),
        ),
      supportPhoneNumber: /* @ngInject */ (constants, currentUser) =>
        constants.SUPPORT[currentUser.ovhSubsidiary],
      confirmTermination: /* @ngInject */ (
        atInternet,
        BillingAutoRenew,
        service,
      ) => () => {
        atInternet.trackClick({
          name: `autorenew::${kebabCase(service.serviceType)}::delete::confirm`,
          type: 'action',
          chapter1: 'dedicated',
          chapter2: 'account',
          chapter3: 'billing',
        });
        service.setForResiliation();
        return BillingAutoRenew.updateService({
          serviceId: service.domain,
          serviceType: service.serviceType,
          renew: service.renew,
        });
      },
      questions: /* @ngInject */ (BillingTerminate, service) =>
        BillingTerminate.getTerminationForm(service.id).then(
          ({ questions }) => questions,
        ),
      user: /* @ngInject */ (currentUser) => currentUser,
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('autorenew_service_delete_title'),
    },
    atInternet: {
      rename: /* @ngInject */ ($state) =>
        // We're limited with the possible injection as we listen to onBefore hook
        `dedicated::account::billing::autorenew::${kebabCase(
          $state.transition.params().serviceType,
        )}::delete`,
    },
  });
};
