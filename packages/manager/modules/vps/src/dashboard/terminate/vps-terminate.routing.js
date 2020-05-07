import { PRICING_MODES } from '../../upscale/upscale.constants';

import component from './vps-terminate.component';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vps.detail.dashboard.terminate', {
    url: '/terminate',
    views: {
      modal: {
        component: component.name,
      },
    },
    layout: 'modal',
    resolve: {
      cancel: /* @ngInject */ ($state) => () => $state.go('^'),
      confirm: /* @ngInject */ (
        $state,
        $translate,
        CucCloudMessage,
        serviceName,
        vpsTerminate,
      ) => () =>
        vpsTerminate
          .confirm(serviceName)
          .then(() =>
            $state
              .go('^')
              .then(() =>
                CucCloudMessage.success(
                  $translate.instant('vps_terminate_success'),
                ),
              ),
          )
          .catch(() =>
            $state
              .go('^')
              .then(() =>
                CucCloudMessage.error(
                  $translate.instant('vps_terminate_error'),
                ),
              ),
          ),
      degressivityInformation: /* @ngInject */ (availableUpgrades) =>
        availableUpgrades.find(({ prices }) =>
          prices[0].pricingMode.includes(PRICING_MODES.DEGRESSIVITY),
        ),
      hasManualRefund: /* @ngInject */ (coreConfig) =>
        coreConfig.isRegion('US'),
      isActionAvailable: /* @ngInject */ (degressivityInformation) =>
        degressivityInformation === undefined,
      supportTicketLink: /* @ngInject */ (coreConfig, CORE_MANAGER_URLS) =>
        `${CORE_MANAGER_URLS.dedicated}/#ticket`,
    },
  });
};
