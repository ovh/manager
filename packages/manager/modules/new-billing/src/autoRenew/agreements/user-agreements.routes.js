import controller from './user-agreements.controller';
import template from './user-agreements.html';
import {
  TRACKING_AGREEMENTS_PAGE_NAME,
  TRACKING_PAGE_CATEGORY,
} from '../autorenew.constants';

export default /* @ngInject */ (
  $stateProvider,
  $urlServiceProvider,
  coreConfigProvider,
) => {
  if (coreConfigProvider.isRegion(['EU', 'CA'])) {
    $stateProvider.state('billing.autorenew.agreements', {
      url: '/agreements',
      template,
      controller,
      redirectTo: (transition) =>
        transition
          .injector()
          .getAsync('currentUser')
          .then((currentUser) => currentUser.isTrusted && 'billing.autorenew'),
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
        gotoAcceptAllAgreements: /* @ngInject */ ($state, atInternet) => (
          agreements,
        ) => {
          atInternet.trackClick({
            name:
              'dedicated::account::billing::autorenew::agreements::go-to-accept-all',
            type: 'action',
          });
          return $state.go('billing.autorenew.agreements.popup-agreement', {
            agreements,
          });
        },
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('user_agreements_list_title'),
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
  }
};
