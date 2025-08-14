import {
  TRACKING_AGREEMENTS_PAGE_NAME,
  TRACKING_PAGE_CATEGORY,
} from '../autorenew.constants';

export default /* @ngInject */ ($stateProvider, $urlServiceProvider) => {
  $stateProvider.state('billing.autorenew.agreements', {
    url: '/agreements?page&itemsPerPage&state&sorting',
    component: 'userAgreements',
    params: {
      page: {
        value: '1',
        squash: true,
      },
      itemsPerPage: {
        value: '10',
        squash: true,
      },
      state: {
        value: null,
        squash: true,
      },
      sorting: {
        value: JSON.stringify({ predicate: 'date', reverse: true }),
        squash: true,
      },
    },
    redirectTo: (transition) => {
      const injector = transition.injector();

      return Promise.all([
        injector.getAsync('currentUser'),
        injector.getAsync('isAgreementsAvailable'),
      ]).then(([currentUser, isAgreementsAvailable]) => {
        if (currentUser.isTrusted || !isAgreementsAvailable) {
          return 'billing.autorenew';
        }
        return null;
      });
    },
    atInternet: {
      ignore: true,
    },
    onEnter: /* @ngInject */ (atInternet) => {
      atInternet.trackPage({
        name: TRACKING_AGREEMENTS_PAGE_NAME,
        page_category: TRACKING_PAGE_CATEGORY,
      });
    },
    onExit: /* @ngInject */ (shellClient) => {
      shellClient.ux.notifyModalActionDone('AgreementsUpdateModal');
    },
    resolve: {
      gotoAcceptAgreements: /* @ngInject */ ($state, atInternet) => (id) => {
        atInternet.trackClick({
          name:
            'dedicated::account::billing::autorenew::agreements::go-to-accept-all',
          type: 'action',
        });
        return $state.go('billing.autorenew.agreements.popup-agreement', {
          id,
        });
      },
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('user_agreements_list_title'),
      hideBreadcrumb: /* @ngInject */ (isAutorenewManagementAvailable) =>
        !isAutorenewManagementAvailable,
      queryParams: /* @ngInject */ ($transition$) => $transition$.params(),
      onQueryParamsChange: /* @ngInject */ ($state) => (params) => {
        $state.go('.', { ...$state.params, ...params }, { notify: false });
      },
      goBack: /* @ngInject */ ($state, queryParams) => () =>
        $state.go('^', queryParams),
      page: /* @ngInject */ (queryParams) => parseInt(queryParams.page, 10),
      itemsPerPage: /* @ngInject */ (queryParams) =>
        Math.min(parseInt(queryParams.itemsPerPage, 10), 300),
      state: /* @ngInject */ (queryParams) => queryParams.state,
      sorting: /* @ngInject */ (queryParams) =>
        !!queryParams.sorting && JSON.parse(queryParams.sorting),
    },
  });

  // ensure compatibility with links sended by emails
  // like #/useraccount/agreements or #/useraccount/agreements/123456/details
  // make a redirect to the new url of ui route
  $urlServiceProvider.rules.when(
    '/useraccount/agreements',
    '/billing/autorenew/agreements',
  );
  $urlServiceProvider.rules.when(
    '/billing/agreements',
    '/billing/autorenew/agreements',
  );
};
