import head from 'lodash/head';

import { USER_DASHBOARD_SHORTCUTS } from './user-dashboard.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.user.dashboard', {
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
      shortcuts: /* @ngInject */ ($state, coreConfig, currentUser) =>
        USER_DASHBOARD_SHORTCUTS.filter(
          ({ regions, isAvailable }) =>
            (!regions || coreConfig.isRegion(regions)) &&
            (!isAvailable || isAvailable(currentUser)),
        ).map((shortcut) => ({
          ...shortcut,
          href: shortcut.state ? $state.href(shortcut.state) : shortcut.href,
        })),
      breadcrumb: () => null,
      hideBreadcrumb: () => true,
    },
  });
};
