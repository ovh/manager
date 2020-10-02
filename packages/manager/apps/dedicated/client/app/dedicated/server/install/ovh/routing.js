import component from './component';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated.server.install.ovh', {
    url: '/ovh',
    component: component.name,
    resolve: {},
  });
};
