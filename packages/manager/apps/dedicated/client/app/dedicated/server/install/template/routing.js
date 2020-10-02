import component from './component';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated.server.install.template', {
    url: '/template',
    component: component.name,
    resolve: {},
  });
};
