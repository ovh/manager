import component from './dedicatedCloud-datacenter-drp-ovh.component';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedClouds.datacenter.drp.ovh', {
    url: '/ovh',
    abstract: true,
    views: {
      'progressTrackerView@app.dedicatedClouds.datacenter.drp': {
        component: component.name,
      },
    },
    redirectTo: 'app.dedicatedClouds.datacenter.drp.ovh.mainPccStep',
  });
};
