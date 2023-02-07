import find from 'lodash/find';
import {
  COLD_ARCHIVE_TRACKING,
  COLD_ARCHIVE_STATES,
} from '../../cold-archives.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(COLD_ARCHIVE_STATES.S3_USERS_IMPORT_POLICY, {
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
  });
};
