import angular from 'angular';

import template from './template.html';

const moduleName = 'ovhManagerVrackAssigneIpModal';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component('vrackAddIpv6Modal', {
    template,
    bindings: {
      onConfirm: '&',
      onCancel: '&',
      isOpenModal: '<',
      state: '<',
    },
  })
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
