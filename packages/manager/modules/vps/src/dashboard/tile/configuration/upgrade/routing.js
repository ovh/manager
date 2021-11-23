import get from 'lodash/get';
import set from 'lodash/set';

import component from './component';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vps.detail.dashboard.configuration.upgrade', {
    url:
      '/upgrade/{upgradeType:memory|storage}?upgradeStatus&upgradeOrderId&from&to',
    layout: 'ouiModal',
    atInternet: {
      rename: /* @ngInject */ ($state) => {
        const { upgradeType, from, to } = $state.transition.params();
        return `vps::detail::dashboard::upgrade-${upgradeType}-${from}-to-${to}`;
      },
    },
    redirectTo: (transition) => {
      const $q = transition.injector().get('$q');
      const upgradeTypePromise = transition.injector().getAsync('upgradeType');
      const configurationTilePromise = transition
        .injector()
        .getAsync('configurationTile');

      return $q
        .all({
          upgradeType: upgradeTypePromise,
          configurationTile: configurationTilePromise,
        })
        .then(({ upgradeType, configurationTile }) => {
          const upgradeToPlan = get(
            configurationTile,
            `upgrades[${upgradeType}].plan`,
          );

          // check if the upgrade is available
          if (!upgradeToPlan) {
            return 'vps.detail.dashboard';
          }

          const upgradeModelPlan = get(
            configurationTile,
            `model[${upgradeType}]`,
          );

          // check if the model is setted correctly => if we access to the state
          // directly (without clicking on oui-radio in dashboard state)
          if (upgradeModelPlan.planCode !== upgradeToPlan.planCode) {
            set(configurationTile.model, upgradeType, upgradeToPlan);
          }

          return null;
        });
    },
    onExit: /* @ngInject */ (configurationTile) => {
      set(configurationTile.model, 'memory', configurationTile.currentPlan);
      set(configurationTile.model, 'storage', configurationTile.currentPlan);
      return configurationTile;
    },
    component: component.name,
    resolve: {
      from: /* @ngInject */ ($transition$) => $transition$.params().from,
      to: /* @ngInject */ ($transition$) => $transition$.params().to,
      upgradeType: /* @ngInject */ ($transition$) =>
        $transition$.params().upgradeType,

      upgradeStatus: /* @ngInject */ ($transition$) =>
        $transition$.params().upgradeStatus,

      upgradeOrderId: /* @ngInject */ ($transition$) =>
        $transition$.params().upgradeOrderId,

      upgradeSuccess: /* @ngInject */ (upgradeStatus) =>
        upgradeStatus === 'success',

      redirectTo: () => 'vps.detail.dashboard',

      upgradeInfo: /* @ngInject */ (
        $q,
        configurationTile,
        serviceName,
        upgradeSuccess,
        upgradeType,
        vpsUpgrade,
      ) => {
        if (upgradeSuccess) {
          return true;
        }

        return vpsUpgrade
          .getUpgrade(
            serviceName,
            get(configurationTile.upgrades, `${upgradeType}.plan.planCode`),
            { quantity: 1 },
          )
          .catch((error) => {
            if (error.status === 400) {
              return { error };
            }

            return $q.reject(error);
          });
      },

      hasDefaultPaymentMethod: /* @ngInject */ (defaultPaymentMethod) =>
        !!defaultPaymentMethod,

      loaders: () => ({
        upgrade: false,
      }),

      /* ----------  ouiModal layout resolves  ---------- */

      type: /* @ngInject */ (upgradeInfo, upgradeStatus) =>
        upgradeInfo.error ? 'warning' : upgradeStatus,

      heading: /* @ngInject */ (
        $translate,
        stateVps,
        upgradeInfo,
        upgradeSuccess,
        upgradeType,
        vps,
      ) => {
        if (upgradeSuccess) {
          return $translate.instant(
            'vps_dashboard_tile_configuration_upgrade_success_title',
          );
        }
        if (upgradeInfo.error) {
          return null;
        }

        const translationKey = `vps_dashboard_tile_configuration_upgrade_${upgradeType}_action_title`;
        const translationValues =
          upgradeType === 'memory'
            ? {
                currentMemory: vps.ram.value,
                nextMemory: vps.ram.value * 2,
              }
            : {
                currentStorage: stateVps.model.disk,
                nextStorage: stateVps.model.disk * 2,
              };

        return $translate.instant(translationKey, translationValues);
      },

      primaryLabel: /* @ngInject */ (
        $translate,
        upgradeInfo,
        upgradeSuccess,
      ) => {
        if (upgradeInfo.error) {
          return $translate.instant(
            'vps_dashboard_tile_configuration_upgrade_button_ok',
          );
        }

        const translationKey = upgradeSuccess
          ? 'vps_dashboard_tile_configuration_upgrade_success_follow_order'
          : 'vps_dashboard_tile_configuration_upgrade_action_validate_and_pay';

        return $translate.instant(translationKey);
      },

      primaryAction: /* @ngInject */ (
        $translate,
        $window,
        atInternet,
        configurationTile,
        coreURLBuilder,
        goBack,
        goToUpgradeSuccess,
        hasDefaultPaymentMethod,
        loaders,
        serviceName,
        upgradeInfo,
        upgradeOrderId,
        upgradeSuccess,
        upgradeType,
        vpsUpgrade,
        from,
        to,
      ) => () => {
        if (upgradeSuccess) {
          return $window.location.replace(
            coreURLBuilder.buildURL('dedicated', '#/billing/orders/:orderId', {
              orderId: upgradeOrderId,
            }),
          );
        }
        if (upgradeInfo.error) {
          return goBack();
        }

        atInternet.trackClick({
          name: `vps::detail::dashboard::upgrade-${upgradeType}-${from}-to-${to}::confirm`,
          type: 'action',
        });
        // launch the upgrade
        set(loaders, 'upgrade', true);

        return vpsUpgrade
          .startUpgrade(
            serviceName,
            get(configurationTile.upgrades, `${upgradeType}.plan.planCode`),
            {
              quantity: 1,
              autoPayWithPreferredPaymentMethod: hasDefaultPaymentMethod,
            },
          )
          .then(({ order }) => {
            if (!hasDefaultPaymentMethod) {
              $window.open(order.url);
              return goBack(
                $translate.instant(
                  'vps_dashboard_tile_configuration_upgrade_no_payment_method_success',
                  {
                    href: order.url,
                    orderId: order.orderId,
                  },
                ),
              );
            }

            return goToUpgradeSuccess(
              {
                upgradeStatus: 'success',
                upgradeOrderId: order.orderId,
              },
              {
                location: false,
                reload: 'vps.detail.dashboard',
              },
            );
          })
          .catch((error) =>
            goBack(
              `${$translate.instant(
                'vps_dashboard_tile_configuration_upgrade_error',
              )} ${get(error, 'data.message', error.message)}`,
              'error',
              error,
            ),
          )
          .finally(() => {
            set(loaders, 'upgrade', false);
          });
      },

      secondaryLabel: /* @ngInject */ (
        $translate,
        upgradeInfo,
        upgradeStatus,
      ) =>
        !upgradeStatus && !upgradeInfo.error
          ? $translate.instant(
              'vps_dashboard_tile_configuration_upgrade_action_cancel',
            )
          : null,

      secondaryAction: /* @ngInject */ (goBack) => () => goBack(),

      loading: /* @ngInject */ (loaders) => () => loaders.upgrade,
    },
  });
};
