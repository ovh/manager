import { DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS } from '../../../../../../components/dedicated-cloud/datacenter/drp/dedicatedCloud-datacenter-drp.constants';

import legacyTemplate from '../../../../../../components/ip/legacyOrder/ip-ip-legacyOrder.html';
import template from '../../../../../../components/ip/agoraOrder/ip-ip-agoraOrder.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state(
      'app.dedicatedCloud.details.datacenter.details.drp.onPremise.ovhPccStep',
      {
        url: '/ovhPcc',
        views: {
          'innerView@app.dedicatedCloud.details.datacenter.details.drp': {
            component: 'ovhManagerDedicatedCloudDatacenterDrpMainPcc',
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
            $state.go('app.dedicatedCloud.details.datacenter.details.drp', {
              selectedDrpType,
            }),
          goToNextStep: /* @ngInject */ ($state) => (drpInformations) =>
            $state.go(
              'app.dedicatedCloud.details.datacenter.details.drp.onPremise.onPremisePccStep',
              { drpInformations },
            ),
          ipAddressDetails: /* @ngInject */ (
            currentService,
            dedicatedCloudDrp,
          ) =>
            dedicatedCloudDrp.getPccIpAddressesDetails(
              currentService.serviceName,
            ),
        },
      },
    )
    .state(
      'app.dedicatedCloud.details.datacenter.details.drp.onPremise.ovhPccStep.legacyOrderIp',
      {
        url: '/legacy-order-ip',
        controller: 'IpLegacyOrderCtrl',
        template: legacyTemplate,
        layout: 'modal',
        translations: { value: ['.'], format: 'json' },
      },
    )
    .state(
      'app.dedicatedCloud.details.datacenter.details.drp.onPremise.ovhPccStep.orderIp',
      {
        url: '/order-ip',
        controller: 'agoraIpOrderCtrl',
        template,
        layout: 'modal',
        translations: { value: ['.'], format: 'json' },
      },
    );
};
