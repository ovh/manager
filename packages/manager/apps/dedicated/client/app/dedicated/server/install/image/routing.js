import component from './component';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated.server.install.image', {
    url: '/image',
    component: component.name,
    resolve: {},
  });
};
