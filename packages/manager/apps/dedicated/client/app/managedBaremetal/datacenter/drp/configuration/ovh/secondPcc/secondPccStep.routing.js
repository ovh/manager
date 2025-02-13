import flatten from 'lodash/flatten';

import {
  DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS,
  DEDICATEDCLOUD_DATACENTER_DRP_STATUS,
} from '../../../../../../components/dedicated-cloud/datacenter/drp/dedicatedCloud-datacenter-drp.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.managedBaremetal.details.datacenters.datacenter.drp.ovh.secondPccStep',
    {
      url: '/secondPcc',
      views: {
        'innerView@app.managedBaremetal.details.datacenters.datacenter.drp': {
          component: 'dedicatedCloudDatacenterDrpOvhSecondPccStep',
        },
      },
      params: {
        currentStep: 2,
        drpInformations: {
          drpType: DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS.ovh,
        },
      },
      resolve: {
        availablePccs: /* @ngInject */ (dedicatedCloudDrp, pccList) =>
          Promise.all(
            pccList.map(({ serviceName }) =>
              dedicatedCloudDrp.getPccDrpPlan(serviceName),
            ),
          ).then((pccWithDrpPlanList) => {
            const pccsWithoutDrp = flatten(
              pccWithDrpPlanList.filter(
                (pccPlans) =>
                  !pccPlans.some(
                    ({ state }) =>
                      state !== DEDICATEDCLOUD_DATACENTER_DRP_STATUS.disabled,
                  ),
              ),
            );

            return pccList
              .filter(({ serviceName }) =>
                pccsWithoutDrp.some(
                  ({ serviceName: pccServiceName }) =>
                    serviceName === pccServiceName,
                ),
              )
              .map(({ description, serviceName }) => ({
                description: description || serviceName,
                serviceName,
              }));
          }),
        drpInformations: /* @ngInject */ ($transition$) =>
          $transition$.params().drpInformations,
        getHostsOrderLink: /* @ngInject */ ($state) => (datacenterId, pccId) =>
          $state.href(
            'app.managedBaremetal.details.datacenters.datacenter.hosts',
            {
              productId: pccId,
              datacenterId,
            },
          ),
        goToPreviousStep: /* @ngInject */ ($state) => (drpInformations) =>
          $state.go(
            'app.managedBaremetal.details.datacenters.datacenter.drp.ovh.mainPccStep',
            {
              drpInformations,
            },
          ),
        pccList: /* @ngInject */ ($transition$, DedicatedCloud) =>
          DedicatedCloud.getAllPccs().then((pccList) =>
            pccList.filter(
              (pcc) =>
                pcc !== undefined &&
                pcc.serviceName !== $transition$.params().productId &&
                pcc.location !==
                  $transition$.params().drpInformations.primaryPcc.location,
            ),
          ),
        breadcrumb: () => null,
      },
    },
  );
};
