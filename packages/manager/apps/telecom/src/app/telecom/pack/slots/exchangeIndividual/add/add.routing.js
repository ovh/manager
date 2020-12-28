import template from './add.html';
import controller from './add.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.packs.pack.exchangeIndividual-add', {
    url: '/exchangeIndividual/add',
    template,
    controller,
    controllerAs: 'ctrl',
  });
};
