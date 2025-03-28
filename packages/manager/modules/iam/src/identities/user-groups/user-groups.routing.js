import { USER_GROUPS_TRACKING_HITS } from './users-groups-constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('iam.identities.user-groups', {
    url: '/user-groups',
    component: 'iamUserGroups',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('iam_identities_user_groups'),
    },
    atInternet: {
      rename: USER_GROUPS_TRACKING_HITS.LISTING_PAGE,
    },
  });
};
