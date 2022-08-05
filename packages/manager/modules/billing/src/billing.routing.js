import controller from './billing.controller';
import template from './billing.html';
import {
  GUIDES_LIST,
  GUIDE_TRACKING_TAG,
} from './constants/guides-header.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.billing', {
    url: '/billing',
    abstract: true,
    translations: { value: ['.'], format: 'json' },
    template,
    controller,
    resolve: {
      denyEnterprise: ($q, $state, currentUser) => {
        if (
          currentUser.isEnterprise &&
          $state.transition.to().name !== 'app.account.billing.autorenew.ssh'
        ) {
          return $q.reject({
            status: 403,
            message: 'Access forbidden for enterprise accounts',
            code: 'FORBIDDEN_BILLING_ACCESS',
          });
        }

        return false;
      },
      goToOrders: /* @ngInject */ ($state) => () =>
        $state.go('app.account.billing.orders'),

      guides: /* @ngInject */ (guidesObjectLevelOne) => {
        return {
          url: guidesObjectLevelOne(GUIDES_LIST),
          tracking: GUIDE_TRACKING_TAG,
        };
      },

      guidesObjectLevelOne: /* @ngInject */ (guidesObjectLevelTwo) => (
        object,
      ) => {
        return Object.fromEntries(
          Object.entries(object).map(([key, value]) => {
            return [key, guidesObjectLevelTwo(value)];
          }),
        );
      },

      guidesObjectLevelTwo: /* @ngInject */ (guidesObjectLevelThree) => (
        object,
      ) => {
        return Object.fromEntries(
          Object.entries(object).map(([key, value]) => {
            return [key, guidesObjectLevelThree(value)];
          }),
        );
      },

      guidesObjectLevelThree: /* @ngInject */ (currentUser) => (object) => {
        return Object.fromEntries(
          Object.entries(object).map(([key, value]) => {
            return [
              key,
              key === 'url'
                ? value[currentUser.ovhSubsidiary] || value.DEFAULT
                : value,
            ];
          }),
        );
      },

      trackClick: /* @ngInject */ (atInternet) => (hit) => {
        return atInternet.trackClick({
          name: hit,
          type: 'action',
        });
      },
    },
  });
};
