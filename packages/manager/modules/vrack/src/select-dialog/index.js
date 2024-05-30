import angular from 'angular';

import template from './template.html';

const moduleName = 'ovhManagerVrackDialogModal';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component('vrackSelectDialogModal', {
    template,
    bindings: {
      onConfirm: '<',
      onCancel: '<',
      isOpenModal: '<',
    },
  })
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
