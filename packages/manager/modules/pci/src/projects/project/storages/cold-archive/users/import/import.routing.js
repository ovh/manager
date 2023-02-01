import find from 'lodash/find';
import { COLD_ARCHIVE_TRACKING } from '../../cold-archives.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.cold-archive.users.import-policy',
    {
      url: '/import-policy?userId',
      views: {
        modal: {
          component: 'pciStoragesColdArchiveUserListImport',
        },
      },
      atInternet: {
        rename: `${COLD_ARCHIVE_TRACKING.PAGE_PREFIX}::${COLD_ARCHIVE_TRACKING.USER.MAIN}::${COLD_ARCHIVE_TRACKING.USER.ACTIONS.IMPORT_POLICY}`,
      },
      layout: 'modal',
      resolve: {
        breadcrumb: () => null, // Hide breadcrumb
        userId: /* @ngInject */ ($transition$) => $transition$.params().userId,
        user: /* @ngInject */ (userList, userId) =>
          find(userList, { id: parseInt(userId, 10) }),
        goBack: /* @ngInject */ (goToUsers) => goToUsers,
      },
    },
  );
};
