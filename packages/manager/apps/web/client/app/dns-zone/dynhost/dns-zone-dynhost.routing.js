import template from '../../domain/dynhost/DYNHOST.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.zone.details.dynhost', {
    url: '/dynhost',
    views: {
      'dnsZoneView@app.zone.details': {
        controller: 'DomainTabDynHostCtrl',
        controllerAs: 'ctrlDomainDynHost',
        template,
      },
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('dnszone_dynhost'),
    },
  });
};
