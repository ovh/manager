import get from 'lodash/get';
import { init, loadRemote } from '@module-federation/runtime';
import component from './component';
import { getWillPaymentUrl } from '../../../common/module-federation-helper';

export default /* @ngInject */ ($stateProvider, $urlRouterProvider) => {
  const name = 'billing.payment.method.add';

  $stateProvider.state(name, {
    url: '/add?paymentMethod&status&paymentMethodId',
    params: {
      status: {
        dynamic: true,
        value: null,
      },
      paymentMethodId: {
        dynamic: true,
        value: null,
      },
      paymentMethod: {
        dynamic: true,
        value: null,
      },
    },
    views: {
      '@billing.payment': {
        component: component.name,
      },
    },
    resolve: {
      setupPaymentAdd: /* @ngInject */ () => {
        init({
          remotes: [
            {
              name: '@payment/method/add',
              alias: 'payment_fm',
              type: 'module',
              entry: getWillPaymentUrl(),
            },
          ],
        });
        return loadRemote('payment_fm/WillPayment');
      },
      getBackButtonHref: /* @ngInject */ ($state, $transition$) => () =>
        $state.href(get($transition$.params(), 'from', '^')),

      status: /* @ngInject */ ($location) => $location.search().status,
      redirectResult: /* @ngInject */ ($location) =>
        $location.search().redirectResult,
      onPaymentMethodAddError: /* @ngInject */ (
        $transition$,
        $translate,
        goPaymentList,
      ) => (error) => {
        return goPaymentList(
          {
            type: 'error',
            text: $translate.instant('billing_payment_method_add_error', {
              errorMessage: error,
            }),
          },
          get($transition$.params(), 'from', null),
        );
      },
      onPaymentMethodAdded: /* @ngInject */ (
        $transition$,
        $translate,
        goPaymentList,
      ) => () => {
        return goPaymentList(
          {
            type: 'success',
            text: $translate.instant(
              'billing_payment_method_add_status_success',
            ),
          },
          get($transition$.params(), 'from', null),
        );
      },

      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('billing_payment_method_add_title'),
    },
    onExit: /* @ngInject */ (shellClient) => {
      shellClient.ux.notifyModalActionDone('PaymentModal');
    },
  });

  $urlRouterProvider.when(/^\/billing\/mean\/add$/, ($location, $state) =>
    $state.go(name),
  );
};
