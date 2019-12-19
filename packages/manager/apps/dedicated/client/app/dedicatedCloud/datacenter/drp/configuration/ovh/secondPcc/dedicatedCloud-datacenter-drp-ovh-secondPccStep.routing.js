import flatten from 'lodash/flatten';

import legacyTemplate from '../../../../../../ip/ip/legacyOrder/ip-ip-legacyOrder.html';
import template from '../../../../../../ip/ip/agoraOrder/ip-ip-agoraOrder.html';

import component from './dedicatedCloud-datacenter-drp-ovh-secondPccStep.component';

import {
  DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS,
  DEDICATEDCLOUD_DATACENTER_DRP_STATUS,
} from '../../../dedicatedCloud-datacenter-drp.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('app.dedicatedClouds.datacenter.drp.ovh.secondPccStep', {
      url: '/secondPcc',
      views: {
        'innerView@app.dedicatedClouds.datacenter.drp': {
          component: component.name,
        },
      },
      params: {
        currentStep: 2,
        drpInformations: {
          drpType: DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS.ovh,
        },
      },
      resolve: {
        availablePccs: /* @ngInject */ (
          dedicatedCloudDrp,
          pccList,
        ) => Promise
          .all(pccList
            .map(({ serviceName }) => dedicatedCloudDrp
              .getPccDrpPlan(serviceName)))
          .then((pccWithDrpPlanList) => {
            const pccsWithoutDrp = flatten(
              pccWithDrpPlanList.filter((pccPlans) => !pccPlans.some(
                ({ state }) => state !== DEDICATEDCLOUD_DATACENTER_DRP_STATUS
                  .disabled,
              )),
            );

            return pccList
              .filter(
                ({ serviceName }) => pccsWithoutDrp
                  .some(
                    ({ serviceName: pccServiceName }) => serviceName
                      === pccServiceName,
                  ),
              )
              .map(({ description, serviceName }) => ({
                description: description || serviceName,
                serviceName,
              }));
          }),
        drpInformations: /* @ngInject */ ($transition$) => $transition$.params()
          .drpInformations,
        goToPreviousStep: /* @ngInject */ ($state) => (drpInformations) => $state.go('app.dedicatedClouds.datacenter.drp.ovh.mainPccStep', { drpInformations }),
        pccList: /* @ngInject */ (
          $transition$,
          DedicatedCloud,
        ) => DedicatedCloud.getAllPccs()
          .then((pccList) => pccList.filter(
            (pcc) => pcc !== undefined
              && pcc.serviceName !== $transition$.params().productId
              && pcc.location !== $transition$.params().drpInformations.primaryPcc
                .location,
          )),
      },
    })
    .state('app.dedicatedClouds.datacenter.drp.ovh.secondPccStep.orderIp', {
      controller: 'agoraIpOrderCtrl',
      template: legacyTemplate,
      layout: 'modal',
      translations: { value: ['.'], format: 'json' },
    })
    .state('app.dedicatedClouds.datacenter.drp.ovh.secondPccStep.legacyOrderIp', {
      controller: 'IpLegacyOrderCtrl',
      template,
      layout: 'modal',
      translations: { value: ['.'], format: 'json' },
    });
};
