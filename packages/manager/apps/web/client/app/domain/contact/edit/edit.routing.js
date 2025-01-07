import { CONTACT_MANAGEMENT_EDIT_TRACKING } from './edit.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.domain.product.contact.edit', {
    url: '/edit-contact/:contactId/',
    params: {
      contactId: null,
    },
    component: 'domainZoneDashboardContactEdit',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate, $transition$) =>
        [
          $translate.instant('domain_tab_CONTACT_edit'),
          $transition$.params().productId,
        ].join(' '),
      contactId: /* @ngInject */ ($transition$) =>
        $transition$.params().contactId,
      contactInformations: /* @ngInject */ (contactId, ContactService) =>
        ContactService.getDomainContactInformations(contactId),
      goBack: /* @ngInject */ ($state, Alerter, $timeout, atInternet) => (
        message = false,
        type = 'success',
      ) => {
        const promise = $state.go('app.domain.product.contact', null, {
          reload: !!message,
        });

        if (message) {
          promise.then(() =>
            $timeout(() => {
              Alerter[type](message, 'dashboardContact');
              atInternet.trackPage({
                ...CONTACT_MANAGEMENT_EDIT_TRACKING.BANNER,
                name: CONTACT_MANAGEMENT_EDIT_TRACKING.BANNER.name.replace(
                  /{{bannerType}}/g,
                  type,
                ),
              });
            }, 1000),
          );
        }

        return promise;
      },
    },
    atInternet: {
      ignore: true,
    },
    onEnter: /* @ngInject */ (atInternet) => {
      atInternet.trackPage(CONTACT_MANAGEMENT_EDIT_TRACKING.PAGE);
    },
  });
};
