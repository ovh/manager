
import component from './component';

export default /* @ngInject */ ($stateProvider) => {
  const name = 'app.account.billing.payment.method.action.delete';

  $stateProvider.state(name, {
    url: '/delete',
    component: component.name,
    layout: 'ouiModal',
    resolve: {
      redirectTo: () => 'app.account.billing.payment.method',

      loaders: () => ({
        deleting: false,
      }),

      /* ----------  ouiModal layout resolves  ---------- */

      heading: /* @ngInject */ $translate => $translate
        .instant('billing_payment_method_delete_title'),

      primaryLabel: /* @ngInject */ $translate => $translate
        .instant('common_confirm'),

      primaryAction: /* @ngInject */ (
        $translate,
        goPaymentList,
        loaders,
        ovhPaymentMethod,
        paymentMethod,
      ) => () => {
        _.set(loaders, 'deleting', true);

        return ovhPaymentMethod.deletePaymentMethod(paymentMethod)
          .then(() => goPaymentList({
            type: 'success',
            text: $translate.instant('billing_payment_method_delete_success'),
          }))
          .catch(error => goPaymentList({
            type: 'error',
            text: $translate.instant('billing_payment_method_delete_error', {
              errorMessage: _.get(error, 'data.message'),
            }),
          }));
      },

      secondaryLabel: /* @ngInject */ $translate => $translate
        .instant('common_cancel'),

      secondaryAction: /* @ngInject */ goPaymentList => goPaymentList,

      loading: /* @ngInject */ loaders => () => loaders.deleting,
    },
  });
};
