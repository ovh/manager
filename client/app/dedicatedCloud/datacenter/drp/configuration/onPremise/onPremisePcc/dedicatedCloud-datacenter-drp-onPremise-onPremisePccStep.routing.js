import component from './dedicatedCloud-datacenter-drp-onPremise-onPremisePccStep.component';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedClouds.datacenter.drp.onPremise.onPremisePccStep', {
    url: '/onPremisePcc',
    views: {
      'innerView@app.dedicatedClouds.datacenter.drp': {
        component: component.name,
      },
    },
    params: {
      currentStep: 2,
      drpInformations: { },
    },
    resolve: {
      goToPreviousStep: /* @ngInject */ $state => drpInformations => $state.go('app.dedicatedClouds.datacenter.drp.onPremise.ovhPccStep', { drpInformations }),
    },
  });
};
