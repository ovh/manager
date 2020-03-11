import get from 'lodash/get';
import set from 'lodash/set';

import VpsConfigurationTile from '../service';

import component from './component';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vps.detail.dashboard.configuration.upgrade', {
    url: '/upgrade/{upgradeType:memory|storage}',
    layout: 'ouiModal',
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
    onExit: (transition) => {
      const configurationTilePromise = transition
        .injector()
        .getAsync('configurationTile');

      return configurationTilePromise.then((configurationTile) => {
        set(
          configurationTile.model,
          'memory',
          VpsConfigurationTile.currentPlan,
        );
        set(
          configurationTile.model,
          'storage',
          VpsConfigurationTile.currentPlan,
        );
      });
    },
    component: component.name,
    resolve: {
      upgradeType: ($transition$) => $transition$.params().upgradeType,

      redirectTo: () => 'vps.detail.dashboard',

      // upgradeInfo: /* @ngInject */ (
      //   availableConfigTileUpgrades,
      //   serviceName,
      //   upgradeType,
      //   vpsUpgrade
      // ) => vpsUpgrade
      //   .getUpgrade(serviceName, get(availableConfigTileUpgrades, `${upgradeType}.plan.planCode`)),

      /* ----------  ouiModal layout resolves  ---------- */

      heading: /* @ngInject */ ($translate, stateVps, upgradeType, vps) => {
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

      primaryLabel: /* @ngInject */ ($translate) =>
        $translate.instant(
          'vps_dashboard_tile_configuration_upgrade_action_validate_and_pay',
        ),

      secondaryLabel: /* @ngInject */ ($translate) =>
        $translate.instant(
          'vps_dashboard_tile_configuration_upgrade_action_cancel',
        ),

      secondaryAction: /* @ngInject */ (goBack) => () => goBack(),
    },
  });
};
