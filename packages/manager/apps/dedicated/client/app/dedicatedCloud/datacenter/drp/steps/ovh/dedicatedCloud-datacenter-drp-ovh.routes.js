import template from './dedicatedCloud-datacenter-drp-ovh.html';

angular.module('App').config(/* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedClouds.datacenter.drp.ovh', {
    abstract: true,
    views: {
      'progressTrackerView@app.dedicatedClouds.datacenter.drp': {
        template,
      },
    },
    redirectTo: 'app.dedicatedClouds.datacenter.drp.ovh.mainPccStep',
  });
});
