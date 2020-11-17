import component from '../../../../../components/dedicated-cloud/service-pack/upgrade/upgrade.component';
import stepModuleNames from '../../../../../components/dedicated-cloud/service-pack/upgrade/types/basicOptions/basicOptions.steps';

export const state = {
  name: 'app.managedBaremetal.servicePackUpgrade.basicOptions',
  params: {
    activationType: 'basic',
  },
  resolve: {
    backButtonText: /* @ngInject */ ($translate) =>
      $translate.instant('ovhManagerPccServicePackUpgradeBasicOptions_header'),
    orderableServicePacks: /* @ngInject */ (
      currentService,
      currentUser,
      UpgradeBasicOptionsService,
    ) =>
      UpgradeBasicOptionsService.getOrderableServicePacks(
        currentService.name,
        currentUser.ovhSubsidiary,
      ),
    steps: /* @ngInject */ (pccServicePackUpgradeService) =>
      pccServicePackUpgradeService.buildSteps(stepModuleNames),
  },
  url: '/basicOptions',
  views: {
    'pccView@app.managedBaremetal': component.name,
  },
};

export const registerState = /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(state.name, state);
};

export default {
  state,
  registerState,
};
