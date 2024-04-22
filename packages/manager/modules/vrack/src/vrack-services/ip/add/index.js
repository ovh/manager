import angular from 'angular';

import template from './template.html';
import controller from './controller';

const moduleName = 'ovhManagerVrackAssignedIpServiceAddSubnetModal';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component('addIpv6SubnetModal', {
    template,
    controller,
    bindings: {
      onConfirm: '&',
      isOpenModal: '=',
    },
  })
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
