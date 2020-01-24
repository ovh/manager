import endsWith from 'lodash/endsWith';
import filter from 'lodash/filter';
import sortBy from 'lodash/sortBy';
import union from 'lodash/union';

import { WEB_HOSTING_NOT_USABLE_DOMAINS } from './activate.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.activate', {
    url: '/activate',
    component: 'webHostingEmailActivate',
    resolve: {
      domainNames: /* @ngInject */ ($q, Hosting, Domain) =>
        $q
          .all({
            domains: Domain.getDomains(),
            hostings: Hosting.getHostings(),
          })
          .then(({ domains, hostings }) =>
            sortBy(
              filter(
                union(domains, hostings),
                (domain) => !endsWith(domain, WEB_HOSTING_NOT_USABLE_DOMAINS),
              ),
            ),
          ),
    },
  });
};
