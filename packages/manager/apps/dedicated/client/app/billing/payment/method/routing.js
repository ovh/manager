import filter from 'lodash/filter';
import find from 'lodash/find';

import component from './component';

export default /* @ngInject */ (
  $stateProvider,
  $transitionsProvider,
  $urlRouterProvider,
) => {
  const name = 'app.account.billing.payment.method';

  $stateProvider.state(name, {
    url: '/method',
    component: component.name,
    resolve: {
      getActionHref: /* @ngInject */ ($state) => (action, params = {}) => {
        if (action !== 'add') {
          return $state.href(`${name}.action.${action}`, params);
        }
        return $state.href(`${name}.${action}`, params);
      },

      guides: /* @ngInject */ (User) => User.getUrlOf('guides'),

      paymentMethods: /* @ngInject */ (
        OVH_PAYMENT_MEAN_STATUS,
        OVH_PAYMENT_METHOD_TYPE,
        ovhPaymentMethod,
      ) =>
        ovhPaymentMethod
          .getAllPaymentMethods({
            transform: true,
          })
          .then((paymentMethods) =>
            filter(paymentMethods, ({ paymentType, status }) => {
              if (paymentType !== OVH_PAYMENT_METHOD_TYPE.BANK_ACCOUNT) {
                return true;
              }
              return status !== OVH_PAYMENT_MEAN_STATUS.BLOCKED_FOR_INCIDENTS;
            }),
          ),

      goPaymentList: /* @ngInject */ ($timeout, Alerter, $state) => (
        message = null,
        altState = null,
      ) => {
        const reload = message && message.type === 'success';

        const stateGoPromise = $state.go(
          altState || name,
          {},
          {
            reload,
          },
        );

        if (message) {
          stateGoPromise.then(() => {
            $timeout(() =>
              Alerter[message.type](
                message.text,
                'billing_payment_method_alert',
              ),
            );
          });
        }
      },

      user: /* @ngInject */ (User) => User.getUser(),
    },
  });

  // add an abstract state that will handle actions on payment method
  $stateProvider.state(`${name}.action`, {
    url: '/{paymentMethodId:int}',
    abstract: true,
    resolve: {
      paymentMethod: /* @ngInject */ ($transition$, paymentMethods) =>
        find(paymentMethods, {
          paymentMethodId: $transition$.params().paymentMethodId,
        }),
    },
  });

  $urlRouterProvider.when(/^\/billing\/mean$/, ($location, $state) =>
    $state.go(name),
  );
};
