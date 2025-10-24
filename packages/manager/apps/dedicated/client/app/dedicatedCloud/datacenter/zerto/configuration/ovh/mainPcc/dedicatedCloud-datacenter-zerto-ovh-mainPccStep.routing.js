import { DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS } from '../../../../../../components/dedicated-cloud/datacenter/zerto/dedicatedCloud-datacenter-zerto.constants';

import legacyTemplate from '../../../../../../components/ip/legacyOrder/ip-ip-legacyOrder.html';
import template from '../../../../../../components/ip/agoraOrder/ip-ip-agoraOrder.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state(
      'app.dedicatedCloud.details.datacenter.details.zerto.ovh.mainPccStep',
      {
        url: '/mainPcc',
        views: {
          'innerView@app.dedicatedCloud.details.datacenter.details.zerto': {
            component: 'ovhManagerDedicatedCloudDatacenterZertoMainPcc',
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
            $state.go('app.dedicatedCloud.details.datacenter.details.zerto', {
              selectedZertoType,
            }),
          goToNextStep: /* @ngInject */ ($state) => (zertoInformations) =>
            $state.go(
              'app.dedicatedCloud.details.datacenter.details.zerto.ovh.secondPccStep',
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
      'app.dedicatedCloud.details.datacenter.details.zerto.ovh.mainPccStep.legacyOrderIp',
      {
        url: '/legacyOrderIp',
        controller: 'IpLegacyOrderCtrl',
        controllerAs: 'ctrl',
        template: legacyTemplate,
        layout: 'modal',
        translations: { value: ['.'], format: 'json' },
        resolve: {
          breadcrumb: () => null,
        },
      },
    )
    .state(
      'app.dedicatedCloud.details.datacenter.details.zerto.ovh.mainPccStep.orderIp',
      {
        url: '/orderIp',
        controller: 'agoraIpOrderCtrl',
        controllerAs: 'ctrl',
        template,
        layout: 'modal',
        translations: { value: ['.'], format: 'json' },
        resolve: {
          breadcrumb: () => null,
        },
      },
    );
};
