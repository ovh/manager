import endsWith from 'lodash/endsWith';
import filter from 'lodash/filter';
import sortBy from 'lodash/sortBy';
import union from 'lodash/union';

import { WEB_HOSTING_NOT_USABLE_DOMAINS } from './activate.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.dashboard.activate', {
    url: '/activate',
    component: 'webHostingEmailActivate',
    resolve: {
      domainNames: /* @ngInject */ ($http, $q, Hosting, Domain) =>
        $q
          .all({
            domains: Domain.getDomains(),
            hostings: Hosting.getHostings(),
            zones: $http.get('/domain/zone').then(({ data }) => data),
          })
          .then(({ domains, hostings, zones }) =>
            sortBy(
              filter(
                union(domains, hostings, zones),
                (domain) => !endsWith(domain, WEB_HOSTING_NOT_USABLE_DOMAINS),
              ),
            ),
          ),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('hosting_email_address_activate_title'),
    },
  });
};
