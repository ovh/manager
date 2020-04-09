import { DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS } from '../../../dedicatedCloud-datacenter-drp.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('app.dedicatedClouds.datacenter.drp.ovh.mainPccStep', {
      url: '/mainPcc',
      views: {
        'innerView@app.dedicatedClouds.datacenter.drp': {
          component: 'dedicatedCloudDatacenterDrpOvhMainPccStep',
        },
      },
      params: {
        currentStep: 1,
        drpInformations: {
          drpType: DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS.ovh,
        },
      },
      resolve: {
        configurationStepName: () => 'mainPccStep',
        datacenterId: /* @ngInject */ ($transition$) =>
          $transition$.params().datacenterId,
        drpInformations: /* @ngInject */ ($transition$) =>
          $transition$.params().drpInformations,
        goBackToChoice: /* @ngInject */ ($state) => (selectedDrpType) =>
          $state.go('app.dedicatedClouds.datacenter.drp', { selectedDrpType }),
        goToNextStep: /* @ngInject */ ($state) => (drpInformations) =>
          $state.go('app.dedicatedClouds.datacenter.drp.ovh.secondPccStep', {
            drpInformations,
          }),
        ipAddressDetails: /* @ngInject */ (currentService, dedicatedCloudDrp) =>
          dedicatedCloudDrp.getPccIpAddressesDetails(
            currentService.serviceName,
          ),
      },
    })
    .state('app.dedicatedClouds.datacenter.drp.ovh.mainPccStep.ipOrder', {
      url: '/orderIp',
      views: {
        modal: {
          component: 'ipDashboardOrder',
        },
      },
      layout: 'modal',
      resolve: {
        goBack: /* @ngInject */ ($state) => (params, transitionParams) =>
          $state.go('^', params, transitionParams),
      },
      translations: { value: ['.'], format: 'json' },
    })
    .state('app.dedicatedClouds.datacenter.drp.ovh.mainPccStep.ipOrderLegacy', {
      url: '/legacyOrderIp',
      views: {
        modal: {
          component: 'ipDashboardOrderLegacy',
        },
      },
      layout: 'modal',
      resolve: {
        goBack: /* @ngInject */ ($state) => (params, transitionParams) =>
          $state.go('^', params, transitionParams),
        goToOrganisation: /* @ngInject */ ($state) => (
          params,
          transitionParams,
        ) => $state.go('app.ip.organisation', params, transitionParams),
      },
      translations: { value: ['.'], format: 'json' },
    });
};
