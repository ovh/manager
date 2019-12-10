import component from './dedicatedCloud-datacenter-drp-onPremise.component';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedClouds.datacenter.drp.onPremise', {
    url: '/onPremise',
    abstract: true,
    views: {
      'progressTrackerView@app.dedicatedClouds.datacenter.drp': {
        component: component.name,
      },
    },
    redirectTo: 'app.dedicatedClouds.datacenter.drp.onPremise.ovhPccStep',
  });
};
