export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nasha.new', {
    url: '/new',
    component: 'nashaNew',
    resolve: {
      breadcrumb: () => null,
    },
  });
};
