import component from './dedicatedCloud-datacenter-drp-summary-delete.component';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('app.dedicatedClouds.datacenter.drp.summary.deleteDrp', {
      url: '/deleteDrp',
      views: {
        modal: {
          component: component.name,
        },
      },
      layout: 'modal',
      resolve: {
        drpInformations: /* @ngInject */ (currentDrp, dedicatedCloudDrp) => dedicatedCloudDrp
          .constructor.getPlanServiceInformations(currentDrp),

        goBack: /* @ngInject */ $state => () => $state.go('^'),
      },
    });
};
