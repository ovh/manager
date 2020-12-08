import controller from './activation.controller';
import template from './activation.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.packs.pack.domain-activation', {
    url: '/domain/activation',
    template,
    controller,
    controllerAs: 'PackDomainActivation',
  });
};
