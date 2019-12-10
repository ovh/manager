import component from './dedicatedCloud-datacenter-drp-summary.component';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedClouds.datacenter.drp.summary', {
    url: '/summary',
    views: {
      'innerView@app.dedicatedClouds.datacenter.drp': {
        component: component.name,
      },
    },
    params: {
      drpInformations: {},
    },
    resolve: {
      goToDeleteDrpModal: /* @ngInject */ $state => () => $state.go('app.dedicatedClouds.datacenter.drp.summary.deleteDrp'),
    },
  });
};
