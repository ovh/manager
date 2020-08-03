angular.module('managerApp').run(($transitions, CdaService) => {
  $transitions.onSuccess({ to: 'paas.cda.**' }, (transition) => {
    CdaService.initDetails(transition.params().serviceName);
  });
});
