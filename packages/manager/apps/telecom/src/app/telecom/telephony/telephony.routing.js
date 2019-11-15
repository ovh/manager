import get from 'lodash/get';


import template from './telecom-telephony.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony', {
    url: '/telephony',
    abstract: true,
    views: {
      'telecomView@telecom': {
        template,
      },
    },
  });

  $stateProvider.state('telecom.telephony.index', {
    url: '?page&pageSize&sort&sortOrder&filter',
    views: {
      'telephonyView@telecom.telephony': {
        component: 'telecomTelephony',
      },
    },
    params: {
      page: {
        value: '1',
        squash: true,
      },
      pageSize: {
        value: '10',
        squash: true,
      },
      sort: {
        value: 'name',
        squash: true,
      },
      sortOrder: {
        value: 'ASC',
        squash: true,
      },
      filter: {
        value: '[]',
        squash: true,
      },
    },
    resolve: {
      loadResource: /* @ngInject */ OvhApiTelephonyService => resource => OvhApiTelephonyService
        .v6()
        .query({
          billingAccount: resource.billingAccount,
        })
        .$promise
        .then(services => ({
          ...resource,
          numServices: services.length,
        })),

      filter: /* @ngInject */ $transition$ => $transition$.params().filter,
      paginationNumber: /* @ngInject */ resources => parseInt(
        get(resources.headers, 'x-pagination-number'),
        10,
      ),
      paginationSize: /* @ngInject */ resources => parseInt(
        get(resources.headers, 'x-pagination-size'),
        10,
      ),
      paginationTotalCount: /* @ngInject */ resources => parseInt(
        get(resources.headers, 'x-pagination-elements'),
        10,
      ),


      onListParamsChange: /* @ngInject */ $state => params => $state.go(
        '.',
        params,
        {
          notify: false,
        },
      ),
      sort: /* @ngInject */ resources => get(resources.headers, 'x-pagination-sort'),
      sortOrder: /* @ngInject */ resources => get(resources.headers, 'x-pagination-sort-order'),
      resources: /* @ngInject */ ($transition$, iceberg) => {
        const {
          filter,
          pageSize,
          sort,
          sortOrder,
        } = $transition$.params();
        let { page } = $transition$.params();

        const filtersParsed = JSON.parse(filter);

        if (filtersParsed.length > 0) {
          page = 1;
        }

        let request = iceberg('/telephony')
          .query()
          .expand('CachedObjectList-Pages')
          .limit(pageSize)
          .offset(page)
          .sort(sort, sortOrder);

        const FILTER_OPERATORS = {
          contains: 'like',
          is: 'eq',
          isAfter: 'gt',
          isBefore: 'lt',
          isNot: 'ne',
          smaller: 'lt',
          bigger: 'gt',
          startsWith: 'like',
          endsWith: 'like',
        };

        filtersParsed.forEach(({ field, comparator, reference }) => {
          request = request.addFilter(
            field,
            get(FILTER_OPERATORS, comparator),
            reference.map((val) => {
              switch (comparator.toUpperCase()) {
                case 'CONTAINS':
                  return `%25${val}%25`;
                case 'STARTSWITH':
                  return `${val}%25`;
                case 'ENDSWITH':
                  return `%25${val}`;
                default:
                  return val;
              }
            }),
          );
        });

        return request.execute(null).$promise;
      },
      getBillingAccountLink: /* @ngInject */ $state => ({ billingAccount }) => $state.href(
        'telecom.telephony.billingAccount',
        {
          billingAccount,
        },
      ),
      getBillingAccountServicesLink: /* @ngInject */ $state => ({ billingAccount }) => $state.href(
        'telecom.telephony.billingAccount.services',
        {
          billingAccount,
        },
      ),
    },
  });
};
