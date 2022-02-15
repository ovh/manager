import angular from 'angular';

import {
  pricingConstants,
  workflowConstants,
} from '@ovh-ux/manager-product-offers';

import { TRACKING_PREFIX } from '../../constants';
import { UPGRADE_TRACKING_PREFIX } from './upgrade-pack.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('anthos.dashboard.general-information.upgrade-pack', {
    url: '/upgrade-pack',
    views: {
      'anthosTenantView@anthos.dashboard': 'anthosDashboardUpgradePack',
    },
    params: {
      pack: { value: null },
    },
    resolve: {
      breadcrumb: () => null,
      pack: /* @ngInject */ ($transition$) => $transition$.params().pack,
      pricingType: () => pricingConstants.PRICING_CAPACITIES.UPGRADE,
      workflowType: () => workflowConstants.WORKFLOW_TYPES.SERVICES,
      workflowOptions: /* @ngInject */ (packInfo, serviceInfo) => ({
        serviceId: serviceInfo.serviceId,
        durationToUse: 'P1M',
        plancodes: angular.copy(packInfo.upgrades),
      }),
      trackChangePack: /* @ngInject */ (
        workflowOptions,
        packInfo,
        atInternet,
      ) => (type) => {
        const changePack = 'change-pack'.concat(type ? `-${type}` : '');
        const oldPlanCode = packInfo.current.planCode;
        const newPlanCode = workflowOptions.getPlanCode();
        atInternet.trackClick({
          name: `${UPGRADE_TRACKING_PREFIX}::${changePack}::${oldPlanCode}::${newPlanCode}`,
          type: 'action',
        });
      },
    },
    atInternet: {
      rename: `${TRACKING_PREFIX}::upgrade-pack`,
    },
  });
};
