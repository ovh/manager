export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('cloud-connect.details.overview.edit-description', {
    url: '/edit-description',
    params: {
      description: null,
    },
    views: {
      modal: {
        component: 'cloudConnectDetailsEditDescription',
      },
    },
    translations: {
      value: ['.'],
      format: 'json',
    },
    layout: 'modal',
    resolve: {
      description: /* @ngInject */ ($transition$) =>
        $transition$.params().description,
      goBack: /* @ngInject */ (goToCloudConnectPage) => goToCloudConnectPage,
    },
  });
};
