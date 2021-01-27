import controller from '../../domain/zone/domain-zone-dns.controller';
import template from '../../domain/zone/domain-zone-dns.html';

import { SUCCESS_TYPE } from './dns-zone-dashboard.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.domain.dns-zone.dashboard', {
    views: {
      'dnsZoneView@app.domain.dns-zone': {
        controller,
        controllerAs: 'ctrlDomainTabZoneDns',
        template,
      },
    },
    resolve: {
      activateZone: /* @ngInject */ ($state) => () =>
        $state.go('app.domain.product.zone.activate'),
      orderZone: /* @ngInject */ ($state) => () =>
        $state.go('app.dns-zone-new'),
      goToZone: /* @ngInject */ ($state, Alerter) => (
        message = false,
        type = SUCCESS_TYPE,
      ) => {
        const reload = message && type === SUCCESS_TYPE;

        const promise = $state.go('app.domain.product.zone', null, {
          reload,
        });

        if (message) {
          promise.then(() => Alerter[type](message, 'domain_alert_main'));
        }

        return promise;
      },
    },
  });
};
