import { CONTACT_MANAGEMENT_EDIT_TRACKING } from './edit.constants';

export default /* @ngInject */ ($stateProvider) => {
  const state = {
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
    },
    atInternet: {
      ignore: true,
    },
    onEnter: /* @ngInject */ (atInternet) => {
      atInternet.trackPage(CONTACT_MANAGEMENT_EDIT_TRACKING.PAGE);
    },
  };

  $stateProvider.state('app.domain.product.contact.edit', {
    ...state,
    resolve: {
      ...state.resolve,
      goBack: /* @ngInject */ ($state, Alerter, $timeout, atInternet) => (
        message = false,
        type = 'success',
      ) => {
        const promise = $state.go('app.domain.product.contact', null, {
          reload: !!message,
        });

        if (message) {
          const replaceValue = {
            '{{bannerType}}_success': 'info',
            '{{returnType}}_success': 'success',
            '{{bannerType}}_error': 'error',
            '{{returnType}}_error': 'error',
          };
          promise.then(() =>
            $timeout(() => {
              Alerter[type](message, 'dashboardContact');
              atInternet.trackPage({
                ...CONTACT_MANAGEMENT_EDIT_TRACKING.BANNER,
                name: CONTACT_MANAGEMENT_EDIT_TRACKING.BANNER.name.replace(
                  /{{bannerType}}|{{returnType}}/g,
                  (match) => replaceValue[`${match}_${type}`],
                ),
                page: {
                  name: CONTACT_MANAGEMENT_EDIT_TRACKING.BANNER.page.name.replace(
                    /{{bannerType}}|{{returnType}}/g,
                    (match) => replaceValue[`${match}_${type}`],
                  ),
                },
              });
            }, 2000),
          );
        }

        return promise;
      },
    },
  });

  $stateProvider.state('app.alldom.domain.contact.edit', {
    ...state,
    resolve: {
      ...state.resolve,
      goBack: /* @ngInject */ ($state, Alerter, $timeout, atInternet) => (
        message = false,
        type = 'success',
      ) => {
        const promise = $state.go('app.alldom.domain.contact', null, {
          reload: !!message,
        });

        if (message) {
          const replaceValue = {
            '{{bannerType}}_success': 'info',
            '{{returnType}}_success': 'success',
            '{{bannerType}}_error': 'error',
            '{{returnType}}_error': 'error',
          };
          promise.then(() =>
            $timeout(() => {
              Alerter[type](message, 'dashboardContact');
              atInternet.trackPage({
                ...CONTACT_MANAGEMENT_EDIT_TRACKING.BANNER,
                name: CONTACT_MANAGEMENT_EDIT_TRACKING.BANNER.name.replace(
                  /{{bannerType}}|{{returnType}}/g,
                  (match) => replaceValue[`${match}_${type}`],
                ),
                page: {
                  name: CONTACT_MANAGEMENT_EDIT_TRACKING.BANNER.page.name.replace(
                    /{{bannerType}}|{{returnType}}/g,
                    (match) => replaceValue[`${match}_${type}`],
                  ),
                },
              });
            }, 2000),
          );
        }

        return promise;
      },
    },
  });
};
