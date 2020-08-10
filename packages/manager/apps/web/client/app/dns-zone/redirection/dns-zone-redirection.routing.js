import template from '../../domain/redirection/REDIRECTION.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.zone.details.redirection', {
    url: '/redirection',
    views: {
      'dnsZoneView@app.zone.details': {
        controller: 'controllers.Domain.Redirection',
        controllerAs: 'ctrlDomainRedirection',
        template,
      },
    },
  });
};
