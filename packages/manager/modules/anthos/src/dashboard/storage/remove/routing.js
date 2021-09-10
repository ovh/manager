export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('anthos.dashboard.storage.remove', {
    url: '/remove',
    params: {
      storage: null,
    },
    views: {
      modal: {
        component: 'anthosRemoveStorage',
      },
    },
    layout: 'modal',
    resolve: {
      breadcrumb: () => null,

      goBack: /* @ngInject */ (goToStorage) => (message, type) =>
        goToStorage(message, type),

      storage: /* @ngInject */ ($transition$) => $transition$.params().storage,

      removeStorageHitTracking: () => {
        return 'delete-volume';
      },
    },
  });
};
