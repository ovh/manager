import get from 'lodash/get';
import set from 'lodash/set';

import component from './component';

export default /* @ngInject */ ($stateProvider) => {
  const name = 'app.account.billing.payment.method.action.default';

  $stateProvider.state(name, {
    url: '/default',
    component: component.name,
    layout: 'ouiModal',
    resolve: {
      redirectTo: () => 'app.account.billing.payment.method',

      loaders: () => ({
        save: false,
      }),

      /* ----------  ouiModal layout resolves  ---------- */

      heading: /* @ngInject */ ($translate) =>
        $translate.instant('billing_payment_method_default_title'),

      primaryLabel: /* @ngInject */ ($translate) =>
        $translate.instant('common_confirm'),

      primaryAction: /* @ngInject */ (
        $translate,
        goPaymentList,
        loaders,
        ovhPaymentMethod,
        paymentMethod,
      ) => () => {
        set(loaders, 'save', true);

        return ovhPaymentMethod
          .setPaymentMethodAsDefault(paymentMethod)
          .then(() =>
            goPaymentList({
              type: 'success',
              text: $translate.instant(
                'billing_payment_method_default_success',
              ),
            }),
          )
          .catch((error) =>
            goPaymentList({
              type: 'error',
              text: $translate.instant('billing_payment_method_default_error', {
                errorMessage: get(error, 'data.message'),
              }),
            }),
          );
      },

      secondaryLabel: /* @ngInject */ ($translate) =>
        $translate.instant('common_cancel'),

      secondaryAction: /* @ngInject */ (goPaymentList) => goPaymentList,

      loading: /* @ngInject */ (loaders) => () => loaders.save,
      breadcrumb: () => null,
    },
  });
};
