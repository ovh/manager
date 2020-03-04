import component from './dedicatedCloud-dashboard.component';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedClouds.dashboard', {
    component,
  });
};
