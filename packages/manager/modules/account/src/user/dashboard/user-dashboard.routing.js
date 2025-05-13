import head from 'lodash/head';

import { USER_DASHBOARD_SHORTCUTS } from './user-dashboard.constants';

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
      authMethodProvider: /* @ngInject */ () => 'provider',
      lastBill: /* @ngInject */ (OvhApiMeBillIceberg) =>
        OvhApiMeBillIceberg.query()
          .expand('CachedObjectList-Pages')
          .sort('date', 'DESC')
          .limit(1)
          .execute(null, true)
          .$promise.then((lastBill) => head(lastBill.data))
          .catch(() => ({})),
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
