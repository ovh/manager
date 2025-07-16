import flatten from 'lodash/flatten';

import {
  DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS,
  DEDICATEDCLOUD_DATACENTER_DRP_STATUS,
} from '../../../../../../components/dedicated-cloud/datacenter/zerto/dedicatedCloud-datacenter-zerto.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicatedCloud.details.datacenter.details.zerto.ovh.secondPccStep',
    {
      url: '/secondPcc',
      views: {
        'innerView@app.dedicatedCloud.details.datacenter.details.zerto': {
          component: 'dedicatedCloudDatacenterZertoOvhSecondPccStep',
        },
      },
      params: {
        currentStep: 2,
        zertoInformations: {
          zertoType: DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS.ovh,
        },
      },
      resolve: {
        availablePccs: /* @ngInject */ (dedicatedCloudZerto, pccList) =>
          Promise.all(
            pccList.map(({ serviceName }) =>
              dedicatedCloudZerto.getPccZertoPlan(serviceName),
            ),
          ).then((pccWithZertoPlanList) => {
            const pccsWithoutZerto = flatten(
              pccWithZertoPlanList.filter(
                (pccPlans) =>
                  !pccPlans.some(
                    ({ state }) =>
                      state !== DEDICATEDCLOUD_DATACENTER_DRP_STATUS.disabled,
                  ),
              ),
            );

            return pccList
              .filter(({ serviceName }) =>
                pccsWithoutZerto.some(
                  ({ serviceName: pccServiceName }) =>
                    serviceName === pccServiceName,
                ),
              )
              .map(({ description, serviceName }) => ({
                description: description || serviceName,
                serviceName,
              }));
          }),
        zertoInformations: /* @ngInject */ ($transition$) =>
          $transition$.params().zertoInformations,
        getHostsOrderLink: /* @ngInject */ ($state) => (datacenterId, pccId) =>
          $state.href('app.dedicatedCloud.details.datacenter.details.hosts', {
            productId: pccId,
            datacenterId,
          }),
        goToPreviousStep: /* @ngInject */ ($state) => (zertoInformations) =>
          $state.go(
            'app.dedicatedCloud.details.datacenter.details.zerto.ovh.mainPccStep',
            {
              zertoInformations,
            },
          ),
        pccList: /* @ngInject */ ($transition$, DedicatedCloud) =>
          DedicatedCloud.getAllPccs().then((pccList) =>
            pccList.filter(
              (pcc) =>
                pcc !== undefined &&
                pcc.serviceName !== $transition$.params().productId &&
                pcc.location !==
                  $transition$.params().zertoInformations.primaryPcc.location,
            ),
          ),
        breadcrumb: () => null,
      },
    },
  );
};
