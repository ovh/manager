import head from 'lodash/head';

import {
  USER_DASHBOARD_SHORTCUTS,
} from './user-dashboard.constants';

import component from './user-dasboard.component';
import './user-dashboard.less';

angular
  .module('UserAccount')
  .config(/* @ngInject */ ($stateProvider) => {
    const name = 'app.account.user.dashboard';

    $stateProvider.state(name, {
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
        shortcuts: /* @ngInject */ $state => USER_DASHBOARD_SHORTCUTS
          .map(shortcut => ({ ...shortcut, href: $state.href(shortcut.state) })),
      },
    });
  })
  .component('userAccountDashboard', component);
