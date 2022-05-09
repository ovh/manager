export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nasha.dashboard.edit-name', {
    url: '/edit-name',
    views: {
      edit: {
        component: 'nashaComponentsEditName',
      },
    },
    resolve: {
      breadcrumb: () => null,
      close: /* @ngInject */ (goBack) => goBack,
    },
  });
};
