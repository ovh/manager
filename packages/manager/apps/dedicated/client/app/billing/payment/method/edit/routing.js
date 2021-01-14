import get from 'lodash/get';
import set from 'lodash/set';

import component from './component';

export default /* @ngInject */ ($stateProvider) => {
  const name = 'app.account.billing.payment.method.action.edit';

  $stateProvider.state(name, {
    url: '/edit',
    component: component.name,
    layout: 'ouiModal',
    resolve: {
      redirectTo: () => 'app.account.billing.payment.method',

      model: /* @ngInject */ (paymentMethod) => ({
        description: paymentMethod.description,
      }),

      loaders: () => ({
        save: false,
      }),

      /* ----------  ouiModal layout resolves  ---------- */

      heading: /* @ngInject */ ($translate) =>
        $translate.instant('billing_payment_method_edit_title'),

      primaryLabel: /* @ngInject */ ($translate) =>
        $translate.instant('billing_payment_method_edit_action_save'),

      primaryAction: /* @ngInject */ (
        $translate,
        goPaymentList,
        loaders,
        model,
        ovhPaymentMethod,
        paymentMethod,
      ) => () => {
        set(loaders, 'save', true);

        return ovhPaymentMethod
          .editPaymentMethod(paymentMethod, {
            description: model.description,
          })
          .then(() =>
            goPaymentList({
              type: 'success',
              text: $translate.instant('billing_payment_method_edit_success'),
            }),
          )
          .catch((error) =>
            goPaymentList({
              type: 'error',
              text: $translate.instant('billing_payment_method_edit_error', {
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
