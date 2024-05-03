import angular from 'angular';

import template from './template.html';

const moduleName = 'ovhManagerVrackDeleteAssignedIpModal';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component('vrackDeleteIpv6Modal', {
    template,
    bindings: {
      onConfirm: '&',
      onCancel: '&',
      isOpenModal: '<',
    },
  })
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
