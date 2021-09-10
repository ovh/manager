export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('anthos.dashboard.general-information.add-storage', {
    url: '/add-storage',
    views: {
      modal: {
        component: 'addStorage',
      },
    },
    layout: 'modal',
    resolve: {
      breadcrumb: () => null,

      addStorageHitTracking: () => {
        return 'add-volume';
      },
    },
  });
};
