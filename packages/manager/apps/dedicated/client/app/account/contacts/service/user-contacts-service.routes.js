import find from 'lodash/find';
import get from 'lodash/get';

export default /* @ngInject */ ($stateProvider) => {
  const stateName = 'app.account.contacts.services';

  $stateProvider.state(stateName, {
    url: '/services?serviceName&category',
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

          if ($transition$.params().category) {
            const key = `account_contacts_service_category_${
              $transition$.params().category
            }`;
            const title = $translate.instant(key);

            if (title !== key) {
              criteria.push({
                operator: 'is',
                property: 'category',
                value: $transition$.params().category,
                title,
              });
            }
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
        });
      },
      category: /* @ngInject */ ($transition$) =>
        $transition$.params().category,
      editContacts: /* @ngInject */ ($state) => (service) =>
        $state.go(`${stateName}.edit`, {
          service: get(service, 'serviceName'),
          categoryType: get(service, 'serviceType'),
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
    },
  });
};
