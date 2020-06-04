import controller from './domain-zone-dns.controller';
import template from './domain-zone-dns.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.domain.product.zone', {
    url: '/zone',
    views: {
      domainView: {
        template,
        controller,
        controllerAs: 'ctrlDomainTabZoneDns',
      },
    },
    atInternet: {
      rename: 'ZONE',
    },
    resolve: {
      activateZone: /* @ngInject */ ($state) => () =>
        $state.go('app.domain.product.zone.activate'),
      goToZone: /* @ngInject */ ($state, Alerter) => (
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';

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

  $stateProvider.state('app.domain.alldom.zone', {
    url: '/zone',
    views: {
      domainView: {
        template,
        controller,
        controllerAs: 'ctrlDomainTabZoneDns',
      },
    },
    atInternet: {
      rename: 'ZONE',
    },
    resolve: {
      activateZone: /* @ngInject */ ($state) => () =>
        $state.go('app.domain.alldom.zone.activate'),
      goToZone: /* @ngInject */ ($state) => () =>
        $state.go('app.domain.alldom.zone'),
    },
  });
};
