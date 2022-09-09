import filter from 'lodash/filter';
import find from 'lodash/find';

import {
  SPLIT_PAYMENT,
  SPLIT_PAYMENT_FEATURE_NAME,
} from '@ovh-ux/manager-billing-components';

import component from './component';

export default /* @ngInject */ ($stateProvider) => {
  const name = 'app.account.billing.payment.method';
  const allowDefaultChoiceForFirstPaymentMethodFeatureName =
    'billing:allowDefaultChoiceForFirstPaymentMethod';

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

      errors: () => ({
        load: false,
      }),

      goToSplitPaymentAction: /* @ngInject */ ($state, splitPayment) => () =>
        splitPayment.canBeDeactivated
          ? $state.go(
              'app.account.billing.payment.method.deactivateSplitPayment',
            )
          : $state.go(
              'app.account.billing.payment.method.activateSplitPayment',
            ),

      paymentMethods: /* @ngInject */ (
        OVH_PAYMENT_MEAN_STATUS,
        OVH_PAYMENT_METHOD_TYPE,
        ovhPaymentMethod,
        errors,
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
          )
          .catch(() => {
            Object.assign(errors, {
              load: true,
            });
            return [];
          }),

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
              Alerter.set(
                `alert-${message.type === 'error' ? 'danger' : message.type}`,
                message.text,
                null,
                'billing_payment_method_alert',
              ),
            );
          });
        }
      },
      hasAllowDefaultChoiceForFirstPaymentMethod: /* @ngInject */ (
        ovhFeatureFlipping,
      ) =>
        ovhFeatureFlipping
          .checkFeatureAvailability(
            allowDefaultChoiceForFirstPaymentMethodFeatureName,
          )
          .then((feature) =>
            feature.isFeatureAvailable(
              allowDefaultChoiceForFirstPaymentMethodFeatureName,
            ),
          ),
      isSplitPaymentAvailable: /* @ngInject */ (
        $http,
        currentUser,
        ovhFeatureFlipping,
        splitPaymentTag,
      ) =>
        ovhFeatureFlipping
          .checkFeatureAvailability(SPLIT_PAYMENT_FEATURE_NAME)
          .then((feature) =>
            feature.isFeatureAvailable(SPLIT_PAYMENT_FEATURE_NAME),
          )
          .then((isFeatureAvailable) =>
            isFeatureAvailable
              ? $http
                  .get('/me/tag/available')
                  .then(({ data: tags }) =>
                    tags.some(
                      ({ name: tagName }) => tagName === splitPaymentTag,
                    ),
                  )
              : false,
          ),
      splitPayment: /* @ngInject */ (
        $http,
        isSplitPaymentAvailable,
        splitPaymentTag,
        tagStatusEnum,
      ) =>
        isSplitPaymentAvailable
          ? $http
              .get(`/me/tag/${splitPaymentTag}`)
              .then(({ data: tagInfo }) => ({
                canBeActivated: [
                  tagStatusEnum.DELETED,
                  tagStatusEnum.REFUSED,
                ].includes(tagInfo?.status),
                canBeDeactivated: tagStatusEnum.CREATED === tagInfo.status,
                ...tagInfo,
              }))
              .catch(() => ({
                canBeActivated: true,
                canBeDeactivated: false,
              }))
          : null,
      splitPaymentTag: /* @ngInject */ (currentUser) =>
        SPLIT_PAYMENT[currentUser.ovhSubsidiary],
      tagStatusEnum: /* @ngInject */ ($http, isSplitPaymentAvailable) =>
        isSplitPaymentAvailable
          ? $http.get('/me.json').then(({ data: schema }) =>
              schema.models['me.tag.StatusEnum'].enum.reduce(
                (list, status) => ({
                  ...list,
                  [status]: status,
                }),
                {},
              ),
            )
          : [],
      splitPaymentInformationHref: /* @ngInject */ (currentUser, CORE_URLS) =>
        CORE_URLS.splitPaymentInformation[currentUser.ovhSubsidiary],
      breadcrumb: /* @ngInject */ () => null,
      hideBreadcrumb: () => true,
    },
  });

  // add an abstract state that will handle actions on payment method
  $stateProvider.state(`${name}.action`, {
    url: '/{paymentMethodId:int}',
    redirectTo: 'app.account.billing.payment.method',
    resolve: {
      paymentMethod: /* @ngInject */ ($transition$, paymentMethods) =>
        find(paymentMethods, {
          paymentMethodId: $transition$.params().paymentMethodId,
        }),
      breadcrumb: /* @ngInject */ (paymentMethod) => paymentMethod.name,
    },
  });
};
