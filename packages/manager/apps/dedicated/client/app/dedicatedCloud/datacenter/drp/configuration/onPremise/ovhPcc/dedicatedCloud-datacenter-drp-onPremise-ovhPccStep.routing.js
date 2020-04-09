import { DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS } from '../../../dedicatedCloud-datacenter-drp.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('app.dedicatedClouds.datacenter.drp.onPremise.ovhPccStep', {
      url: '/ovhPcc',
      views: {
        'innerView@app.dedicatedClouds.datacenter.drp': {
          component: 'dedicatedCloudDatacenterDrpOnPremiseOvhPccStep',
        },
      },
      params: {
        currentStep: 1,
        drpInformations: {
          drpType: DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS.onPremise,
        },
      },
      resolve: {
        configurationStepName: () => 'ovhPccStep',
        datacenterId: /* @ngInject */ ($transition$) =>
          $transition$.params().datacenterId,
        defaultLocalVraNetwork: /* @ngInject */ (
          $transition$,
          currentService,
          dedicatedCloudDrp,
          drpInformations,
        ) =>
          drpInformations.localVraNetwork === undefined
            ? dedicatedCloudDrp.getDefaultLocalVraNetwork({
                datacenterId: $transition$.params().datacenterId,
                serviceName: currentService.serviceName,
              })
            : null,
        drpInformations: /* @ngInject */ ($transition$) =>
          $transition$.params().drpInformations,
        goBackToChoice: /* @ngInject */ ($state) => (selectedDrpType) =>
          $state.go('app.dedicatedClouds.datacenter.drp', { selectedDrpType }),
        goToNextStep: /* @ngInject */ ($state) => (drpInformations) =>
          $state.go(
            'app.dedicatedClouds.datacenter.drp.onPremise.onPremisePccStep',
            { drpInformations },
          ),
        ipAddressDetails: /* @ngInject */ (currentService, dedicatedCloudDrp) =>
          dedicatedCloudDrp.getPccIpAddressesDetails(
            currentService.serviceName,
          ),
      },
    })
    .state(
      'app.dedicatedClouds.datacenter.drp.onPremise.ovhPccStep.ipOrderLegacy',
      {
        url: '/legacy-order-ip',
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
      },
    )
    .state('app.dedicatedClouds.datacenter.drp.onPremise.ovhPccStep.ipOrder', {
      url: '/order-ip',
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
    });
};
