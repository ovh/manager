import get from 'lodash/get';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.services', {
    url: '/services?page&pageSize&sort&sortOrder&filter',
    views: {
      'groupInnerView@telecom.telephony.billingAccount': {
        component: 'telecomTelephonyBillingAccountServices',
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
      filter: /* @ngInject */ $transition$ => $transition$.params().filter,
      resources: /* @ngInject */ ($transition$, iceberg, billingAccountId) => {
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

        let request = iceberg(`/telephony/${billingAccountId}/service`)
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
      schema: /* @ngInject */ OvhApiTelephony => OvhApiTelephony
        .v6()
        .schema()
        .$promise,
      telephonyFeatureTypes: /* @ngInject */ schema => get(schema.models, 'telephony.TypeEnum').enum,
      telephonyServiceTypes: /* @ngInject */ schema => get(schema.models, 'telephony.TypeServiceEnum').enum,

      getServiceLink: /* @ngInject */ $state => (service) => {
        if (['alias'].includes(service.serviceType)) {
          return $state.href('telecom.telephony.billingAccount.alias', { serviceName: service.serviceName });
        }

        if (['fax', 'voicefax'].includes(service.featureType)) {
          return $state.href('telecom.telephony.billingAccount.fax', { serviceName: service.serviceName });
        }

        if (['carrierSip'].includes(service.featureType)) {
          return $state.href('telecom.telephony.billingAccount.carrierSip', { serviceName: service.serviceName });
        }

        return $state.href('telecom.telephony.billingAccount.line', { serviceName: service.serviceName });
      },
    },
  });
};
