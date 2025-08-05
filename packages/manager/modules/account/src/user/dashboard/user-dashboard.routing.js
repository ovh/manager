import {
  USER_DASHBOARD_SHORTCUTS,
  TRACKING_PAGE,
  TRACKING_PAGE_CATEGORY,
  TRACKING_SHORTCUT_ACTION_PREFIX_NAME,
} from './user-dashboard.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('account.user.dashboard', {
    url: '/dashboard',
    component: 'userAccountDashboard',
    translations: {
      format: 'json',
      value: ['./', '../support-level'],
    },
    resolve: {
      user: /* @ngInject */ (currentUser) => currentUser,
      onClickShortcut: /* @ngInject */ (atInternet) => {
        return (shortcut) => {
          if (shortcut.tracking_name_suffix) {
            atInternet.trackClick({
              name: `${TRACKING_SHORTCUT_ACTION_PREFIX_NAME}::${shortcut.tracking_name_suffix}`,
              type: 'action',
              page_category: TRACKING_PAGE_CATEGORY,
              page: {
                name: TRACKING_PAGE,
              },
            });
          }
        };
      },
      authMethodProvider: /* @ngInject */ () => 'provider',
      shortcuts: /* @ngInject */ (
        $state,
        coreConfig,
        currentUser,
        coreURLBuilder,
      ) =>
        USER_DASHBOARD_SHORTCUTS.filter(
          ({ regions, isAvailable }) =>
            (!regions || coreConfig.isRegion(regions)) &&
            (!isAvailable || isAvailable(currentUser)),
        ).map((shortcut) => {
          let href;

          if (shortcut.state) {
            href = $state.href(shortcut.state);
          } else if (shortcut.url) {
            href = coreURLBuilder.buildURL(
              shortcut.url.baseURL,
              shortcut.url.path,
            );
          } else {
            href = shortcut.href;
          }

          return {
            ...shortcut,
            href,
          };
        }),
      breadcrumb: () => null,
      hideBreadcrumb: () => true,
      iamUsersLink: /* @ngInject */ (coreURLBuilder) =>
        coreURLBuilder.buildURL('iam', '/dashboard/users'),
    },
  });
};
