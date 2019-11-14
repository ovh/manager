import head from 'lodash/head';

import {
  USER_DASHBOARD_SHORTCUTS,
} from './user-dashboard.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.user.dashboard', {
    url: '/dashboard',
    component: 'userAccountDashboard',
    translations: {
      format: 'json',
      value: ['./', '../support-level'],
    },
    resolve: {
      user: /* @ngInject */ currentUser => currentUser,
      lastBill: /* @ngInject */ OvhApiMeBillIceberg => OvhApiMeBillIceberg
        .query()
        .expand('CachedObjectList-Pages')
        .sort('date', 'DESC')
        .limit(1)
        .execute(null, true)
        .$promise
        .then(lastBill => head(lastBill.data)),
      shortcuts: /* @ngInject */ ($state, coreConfig) => USER_DASHBOARD_SHORTCUTS
        .filter(({ regions }) => !regions || regions.includes(coreConfig.getRegion()))
        .map(shortcut => ({ ...shortcut, href: $state.href(shortcut.state) })),
    },
  });
};
