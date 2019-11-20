import map from 'lodash/map';

import controller from './search.controller';
import template from './search.html';

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
        .addFilter('serviceName', 'like', [`%${query}%`])
        .execute()
        .$promise
        .then(results => map(results, result => ({
          ...result,
          billingAccount: result.path.split('/')[2],
        }))),
      billingAccount: (query, iceberg) => iceberg('/telephony')
        .query()
        .expand('CachedObjectList-Pages')
        .addFilter('billingAccount', 'like', [`%25${query}%25`])
        .execute()
        .$promise
        .then(({ data }) => data),
    },
  });
};
