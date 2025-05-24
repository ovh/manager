import find from 'lodash/find';
import get from 'lodash/get';

export default /* @ngInject */ ($stateProvider) => {
  const stateName = 'app.account.contacts.services';

  $stateProvider.state(stateName, {
    url:
      '/services?serviceName&category&contactAdmin&contactTech&contactBilling',
    component: 'accountContactsService',
    translations: {
      format: 'json',
      value: ['.', '..'],
    },
    params: {
      serviceName: {
        value: null,
        dynamic: true,
      },
      category: {
        value: null,
        dynamic: true,
      },
      contactAdmin: {
        value: null,
        dynamic: true,
      },
      contactTech: {
        value: null,
        dynamic: true,
      },
      contactBilling: {
        value: null,
        dynamic: true,
      },
    },
    resolve: {
      criteria: ($transition$, $translate) => {
        const criteria = [];

        return $translate.refresh().then(() => {
          if ($transition$.params().serviceName) {
            criteria.push({
              property: null,
              operator: 'contains',
              value: $transition$.params().serviceName,
              title: $transition$.params().serviceName,
            });
          }

          if ($transition$.params().contactAdmin) {
            criteria.push({
              operator: 'is',
              property: 'contactAdmin',
              value: $transition$.params().contactAdmin,
              title: $transition$.params().contactAdmin,
            });
          }

          if ($transition$.params().contactTech) {
            criteria.push({
              operator: 'is',
              property: 'contactTech',
              value: $transition$.params().contactTech,
              title: $transition$.params().contactTech,
            });
          }

          if ($transition$.params().contactBilling) {
            criteria.push({
              operator: 'is',
              property: 'contactBilling',
              value: $transition$.params().contactBilling,
              title: $transition$.params().contactBilling,
            });
          }

          if ($transition$.params().category) {
            criteria.push({
              operator: 'is',
              property: 'category',
              value: $transition$.params().category,
              title: $translate.instant(
                `account_contacts_service_category_${
                  $transition$.params().category
                }`,
              ),
            });
          }

          return criteria;
        });
      },
      updateCriteria: ($state) => (criteria) => {
        $state.go(stateName, {
          serviceName: get(find(criteria, { property: null }), 'value', null),
          category: get(
            find(criteria, { property: 'category' }),
            'value',
            null,
          ),
          contactAdmin: get(
            find(criteria, { property: 'contactAdmin' }),
            'value',
            null,
          ),
          contactTech: get(
            find(criteria, { property: 'contactTech' }),
            'value',
            null,
          ),
          contactBilling: get(
            find(criteria, { property: 'contactBilling' }),
            'value',
            null,
          ),
        });
      },
      category: /* @ngInject */ ($transition$) =>
        $transition$.params().category,
      contactAdmin: /* @ngInject */ ($transition$) =>
        $transition$.params().contactAdmin,
      contactTech: /* @ngInject */ ($transition$) =>
        $transition$.params().contactTech,
      contactBilling: /* @ngInject */ ($transition$) =>
        $transition$.params().contactBilling,
      editContacts: /* @ngInject */ ($state) => (service) =>
        $state.go(`${stateName}.edit`, {
          service: service.serviceName,
          categoryType: service.category,
        }),
      /* @ngInject */
      getServiceInfos: (AccountContactsService) => (service) =>
        AccountContactsService.getServiceInfos(service).then(
          (serviceInfos) => ({
            ...service,
            ...serviceInfos,
          }),
        ),
      goToContacts: /* @ngInject */ ($state, $timeout, Alerter) => (
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';

        const promise = $state.go(
          stateName,
          {},
          {
            reload,
          },
        );

        if (message) {
          promise.then(() =>
            $timeout(() => Alerter.set(`alert-${type}`, message, null)),
          );
        }

        return promise;
      },

      services: /* @ngInject */ (AccountContactsService) =>
        AccountContactsService.getServices(),
      breadcrumb: () => null,
      hideBreadcrumb: () => true,
    },
  });
};
