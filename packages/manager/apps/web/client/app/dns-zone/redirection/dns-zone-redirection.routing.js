import template from '../../domain/redirection/REDIRECTION.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.domain.dns-zone.redirection', {
    url: '/redirection',
    views: {
      'dnsZoneView@app.domain.dns-zone': {
        controller: 'controllers.Domain.Redirection',
        controllerAs: 'ctrlDomainRedirection',
        template,
      },
    },
  });
};
