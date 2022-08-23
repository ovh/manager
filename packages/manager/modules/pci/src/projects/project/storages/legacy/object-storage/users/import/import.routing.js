import find from 'lodash/find';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.object-storage.users.import-policy',
    {
      url: '/import-policy?userId',
      views: {
        modal: {
          component: 'pciStoragesObjectStorageUserListImport',
        },
      },
      layout: 'modal',
      resolve: {
        breadcrumb: () => null, // Hide breadcrumb
        userId: /* @ngInject */ ($transition$) => $transition$.params().userId,
        user: /* @ngInject */ (userList, userId) =>
          find(userList, { id: parseInt(userId, 10) }),
        goBack: /* @ngInject */ (goToUsers) => goToUsers,
      },
      atInternet: {
        rename:
          'pci::projects::project::storages::objects::s3-policies-users::import-file',
      },
    },
  );
};
