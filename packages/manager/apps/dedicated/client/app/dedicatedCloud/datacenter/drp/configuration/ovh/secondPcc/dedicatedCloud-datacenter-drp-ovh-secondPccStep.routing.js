import flatten from 'lodash/flatten';

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
        configurationStepName: () => 'secondPccStep',
        drpInformations: /* @ngInject */ ($transition$) =>
          $transition$.params().drpInformations,
        getHostsOrderLink: /* @ngInject */ ($state) => (datacenterId, pccId) =>
          $state.href('app.dedicatedClouds.datacenter.hosts', {
            productId: pccId,
            datacenterId,
          }),
        goToPreviousStep: /* @ngInject */ ($state) => (drpInformations) =>
          $state.go('app.dedicatedClouds.datacenter.drp.ovh.mainPccStep', {
            drpInformations,
          }),
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
      },
    })
    .state('app.dedicatedClouds.datacenter.drp.ovh.secondPccStep.ipOrder', {
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
    .state(
      'app.dedicatedClouds.datacenter.drp.ovh.secondPccStep.ipOrderLegacy',
      {
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
      },
    );
};
