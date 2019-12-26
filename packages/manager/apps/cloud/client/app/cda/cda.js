angular
  .module('managerApp')
  .config(($stateProvider) => {
    $stateProvider.state('paas.cda', {
      url: '/cda',
      template: '<div data-ui-view="cdaDetails"></div>',
      translations: {
        format: 'json',
        value: ['.'],
      },
      abstract: true,
    });
  })
  .run(($transitions, CdaService) => {
    $transitions.onSuccess({ to: 'paas.cda.**' }, (transition) => {
      CdaService.initDetails(transition.params().serviceName);
    });
  });
