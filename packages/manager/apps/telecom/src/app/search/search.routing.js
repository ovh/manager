import filter from 'lodash/filter';
import get from 'lodash/get';
import includes from 'lodash/includes';
import map from 'lodash/map';
import some from 'lodash/some';

import controller from './search.controller';
import template from './search.html';

const filterResults = (results, query, properties) => (query ? filter(
  results,
  result => some(properties, property => includes(get(result, property), query)),
) : results);

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecomSearch', {
    url: '/search?q',
    controller,
    controllerAs: '$ctrl',
    template,
    translations: {
      format: 'json',
      value: ['.'],
    },
    params: {
      q: {
        value: null,
        squash: true,
      },
    },
    resolve: {
      query: $transition$ => $transition$.params().q,
      services: (apiv7, query) => apiv7('/telephony/*/service?$aggreg=1')
        .query()
        .execute()
        .$promise
        .then((results) => {
          const filteredResults = filterResults(results, query, ['value.serviceName', 'value.description']);
          return map(filteredResults, result => ({
            ...result,
            billingAccount: result.path.split('/')[2],
          }));
        }),
      billingAccount: (query, iceberg) => iceberg('/telephony')
        .query()
        .expand('CachedObjectList-Pages')
        .execute()
        .$promise
        .then(({ data }) => filterResults(data, query, ['billingAccount', 'description'])),
    },
  });
};
