import { DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS } from '../../../../../components/dedicated-cloud/datacenter/zerto/dedicatedCloud-datacenter-zerto.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicatedCloud.details.datacenter.details.zerto.onPremise',
    {
      url: '/onPremise',
      views: {
        'pccDatacenterView@app.dedicatedCloud.details.datacenter.details':
          'ovhManagerDedicatedCloudDatacenterZertoMainPcc',
      },
      params: {
        zertoInformations: {
          zertoType: DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS.onPremise,
        },
      },
      resolve: {
        datacenterId: /* @ngInject */ ($transition$) =>
          $transition$.params().datacenterId,
        defaultLocalVraNetwork: /* @ngInject */ (
          $transition$,
          currentService,
          dedicatedCloudZerto,
          zertoInformations,
        ) =>
          zertoInformations.localVraNetwork === undefined
            ? dedicatedCloudZerto.getDefaultLocalVraNetwork({
                datacenterId: $transition$.params().datacenterId,
                serviceName: currentService.serviceName,
              })
            : null,
        zertoInformations: /* @ngInject */ ($transition$) =>
          $transition$.params().zertoInformations,
        goBackToChoice: /* @ngInject */ ($state) => (selectedZertoType) =>
          $state.go('app.dedicatedCloud.details.datacenter.details.zerto', {
            selectedZertoType,
          }),
        ipAddressDetails: /* @ngInject */ (
          currentService,
          dedicatedCloudZerto,
        ) =>
          dedicatedCloudZerto.getPccIpAddressesDetails(
            currentService.serviceName,
          ),

        goToNextStep: /* @ngInject */ (setupConfiguration) => (
          zertoInformations,
        ) => setupConfiguration(zertoInformations),
      },
    },
  );
};
