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
      user: /* @ngInject */ (UserAccountService) =>
        UserAccountService.getUser(),
      goToInfos: /* @ngInject */ ($state) => () =>
        $state.go('app.account.user.infos'),
      lastBill: /* @ngInject */ (OvhApiMeBillIceberg) =>
        OvhApiMeBillIceberg.query()
          .expand('CachedObjectList-Pages')
          .sort('date', 'DESC')
          .limit(1)
          .execute(null, true)
          .$promise.then((lastBill) => head(lastBill.data)),
      shortcuts: /* @ngInject */ ($state, coreConfig, user) =>
        USER_DASHBOARD_SHORTCUTS.filter(
          ({ regions, isAvailable }) =>
            (!regions || regions.includes(coreConfig.getRegion())) &&
            (!isAvailable || isAvailable(user)),
        ).map((shortcut) => ({
          ...shortcut,
          href: shortcut.state ? $state.href(shortcut.state) : shortcut.href,
        })),
    },
  });
};
