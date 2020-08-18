import component from '../../upgrade.component';
import stepModuleNames from './basicOptions.steps';

export const state = {
  name: 'app.dedicatedClouds.servicePackUpgrade.basicOptions',
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
  translations: {
    format: 'json',
    value: ['.'],
  },
  url: '/basicOptions',
  views: {
    'pccView@app.dedicatedClouds': component.name,
  },
};

export const registerState = /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(state.name, state);
};

export default {
  state,
  registerState,
};
