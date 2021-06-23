import { DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS } from '../../../../../../components/dedicated-cloud/datacenter/drp/dedicatedCloud-datacenter-drp.constants';

import legacyTemplate from '../../../../../../components/ip/legacyOrder/ip-ip-legacyOrder.html';
import template from '../../../../../../components/ip/agoraOrder/ip-ip-agoraOrder.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state(
      'app.managedBaremetal.details.datacenters.datacenter.drp.ovh.mainPccStep',
      {
        url: '/mainPcc',
        views: {
          'innerView@app.managedBaremetal.details.datacenters.datacenter.drp': {
            component: 'ovhManagerDedicatedCloudDatacenterDrpMainPcc',
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
            $state.go(
              'app.managedBaremetal.details.datacenters.datacenter.drp',
              {
                selectedDrpType,
              },
            ),
          goToNextStep: /* @ngInject */ ($state) => (drpInformations) =>
            $state.go(
              'app.managedBaremetal.details.datacenters.datacenter.drp.ovh.secondPccStep',
              {
                drpInformations,
              },
            ),
          ipAddressDetails: /* @ngInject */ (
            currentService,
            dedicatedCloudDrp,
          ) =>
            dedicatedCloudDrp.getPccIpAddressesDetails(
              currentService.serviceName,
            ),
          breadcrumb: () => null,
        },
      },
    )
    .state(
      'app.managedBaremetal.details.datacenters.datacenter.drp.ovh.mainPccStep.legacyOrderIp',
      {
        url: '/legacyOrderIp',
        controller: 'IpLegacyOrderCtrl',
        controllerAs: 'ctrl',
        template: legacyTemplate,
        layout: 'modal',
        resolve: {
          breadcrumb: () => null,
        },
      },
    )
    .state(
      'app.managedBaremetal.details.datacenters.datacenter.drp.ovh.mainPccStep.orderIp',
      {
        url: '/orderIp',
        controller: 'agoraIpOrderCtrl',
        controllerAs: 'ctrl',
        template,
        layout: 'modal',
        resolve: {
          breadcrumb: () => null,
        },
      },
    );
};
