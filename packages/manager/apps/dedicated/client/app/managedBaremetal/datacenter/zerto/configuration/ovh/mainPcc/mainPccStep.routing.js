import { DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS } from '../../../../../../components/dedicated-cloud/datacenter/zerto/dedicatedCloud-datacenter-zerto.constants';

import legacyTemplate from '../../../../../../components/ip/legacyOrder/ip-ip-legacyOrder.html';
import template from '../../../../../../components/ip/agoraOrder/ip-ip-agoraOrder.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state(
      'app.managedBaremetal.details.datacenters.datacenter.zerto.ovh.mainPccStep',
      {
        url: '/mainPcc',
        views: {
          'innerView@app.managedBaremetal.details.datacenters.datacenter.zerto': {
            component: 'ovhManagerdedicatedCloudDatacenterZertoMainPcc',
          },
        },
        params: {
          currentStep: 1,
          zertoInformations: {
            zertoType: DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS.ovh,
          },
        },
        resolve: {
          datacenterId: /* @ngInject */ ($transition$) =>
            $transition$.params().datacenterId,
          zertoInformations: /* @ngInject */ ($transition$) =>
            $transition$.params().zertoInformations,
          goBackToChoice: /* @ngInject */ ($state) => (selectedZertoType) =>
            $state.go(
              'app.managedBaremetal.details.datacenters.datacenter.zerto',
              {
                selectedZertoType,
              },
            ),
          goToNextStep: /* @ngInject */ ($state) => (zertoInformations) =>
            $state.go(
              'app.managedBaremetal.details.datacenters.datacenter.zerto.ovh.secondPccStep',
              {
                zertoInformations,
              },
            ),
          ipAddressDetails: /* @ngInject */ (
            currentService,
            dedicatedCloudZerto,
          ) =>
            dedicatedCloudZerto.getPccIpAddressesDetails(
              currentService.serviceName,
            ),
          breadcrumb: () => null,
        },
      },
    )
    .state(
      'app.managedBaremetal.details.datacenters.datacenter.zerto.ovh.mainPccStep.legacyOrderIp',
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
      'app.managedBaremetal.details.datacenters.datacenter.zerto.ovh.mainPccStep.orderIp',
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
