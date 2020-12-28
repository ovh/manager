import controller from './activation.controller';
import template from './activation.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.packs.pack.hubic-activation', {
    url: '/hubic/activation',
    template,
    controller,
    controllerAs: 'PackHubicActivation',
  });
};
