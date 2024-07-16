import angular from 'angular';

import template from './template.html';

const moduleName = 'ovhManagerVrackAssignedIpServiceAddSubnetModal';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component('addIpv6SubnetModal', {
    template,
    bindings: {
      context: '=',
    },
  })
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
