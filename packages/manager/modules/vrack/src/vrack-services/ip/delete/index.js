import angular from 'angular';

import template from './template.html';

const moduleName = 'ovhManagerVrackAssignedIpServiceDeleteSubnetModal';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component('deleteIpv6SubnetModal', {
    template,
    controller: [
      '$scope',
      function() {
        this.cancel = () => {
          this.isOpenModal = false;
        };
      },
    ],
    bindings: {
      onConfirm: '&',
      isOpenModal: '=',
    },
  })
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
