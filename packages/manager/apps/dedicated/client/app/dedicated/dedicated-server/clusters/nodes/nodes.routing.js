export default /* @ngInject */ ($stateProvider) => {
  const name = 'app.dedicated-cluster.cluster.allnode';

  $stateProvider.state(name, {
    url: '/node',
    template: '<div ui-view></div>',
  });
};
