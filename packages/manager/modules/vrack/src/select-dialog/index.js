import angular from 'angular';

import template from './template.html';

const moduleName = 'ovhManagerVrackDialogModal';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component('vrackSingleSelectDialogModal', {
    template,
    bindings: {
      onConfirm: '<',
      onCancel: '<',
      isOpenModal: '<',
      isIpv6: '<',
      isVrackService: '<',
    },
  })
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
