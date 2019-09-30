import template from '../../domain/dynhost/DYNHOST.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.domain.dns-zone.dynhost', {
    url: '/dynhost',
    views: {
      'dnsZoneView@app.domain.dns-zone': {
        controller: 'DomainTabDynHostCtrl',
        controllerAs: 'ctrlDomainDynHost',
        template,
      },
    },
  });
};
