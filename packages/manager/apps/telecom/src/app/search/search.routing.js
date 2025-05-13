import filter from 'lodash/filter';
import get from 'lodash/get';
import includes from 'lodash/includes';
import some from 'lodash/some';

import controller from './search.controller';
import template from './search.html';

const filterResults = (results, query, properties) =>
  filter(results, (result) =>
    some(properties, (property) => {
      if (typeof property === 'string')
        return includes(get(result, property), query);

      const { path, verify } = property;
      const value = get(result, path);

      return value && verify(value);
    }),
  );

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
      query: ($transition$) => $transition$.params().q,
      services: (query, telecomSearchResultsService) =>
        query?.length >= 5 && query?.indexOf(' ') === -1 // requirements for the api /telephony/searchServices
          ? telecomSearchResultsService.findTelephonyService(query)
          : null,
      billingAccount: (query, iceberg) =>
        query
          ? iceberg('/telephony')
              .query()
              .expand('CachedObjectList-Pages')
              .execute()
              .$promise.then(({ data }) =>
                filterResults(data, query, ['billingAccount', 'description']),
              )
          : null,
      packs: (query, iceberg) =>
        query
          ? iceberg('/pack/xdsl')
              .query()
              .expand('CachedObjectList-Pages')
              .execute()
              .$promise.then(({ data }) =>
                filterResults(data, query, ['packName', 'description']),
              )
          : null,
      sms: (query, iceberg) =>
        query
          ? iceberg('/sms')
              .query()
              .expand('CachedObjectList-Pages')
              .execute()
              .$promise.then(({ data }) =>
                filterResults(data, query, ['name', 'description']),
              )
          : null,
      freefax: (query, iceberg) =>
        query
          ? iceberg('/freefax')
              .query()
              .expand('CachedObjectList-Pages')
              .execute()
              .$promise.then(({ data }) =>
                filterResults(data, query, ['number', 'fromName']),
              )
          : null,
      overTheBox: (query, iceberg) =>
        query
          ? iceberg('/overTheBox')
              .query()
              .expand('CachedObjectList-Pages')
              .execute()
              .$promise.then(({ data }) =>
                filterResults(data, query, [
                  'serviceName',
                  'customerDescription',
                ]),
              )
          : null,
    },
  });
};
