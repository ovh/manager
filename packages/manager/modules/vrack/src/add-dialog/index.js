import angular from 'angular';

import template from './template.html';

const moduleName = 'ovhManagerVrackAddDialogModal';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component('vrackAddDialogModal', {
    template,
    bindings: {
      onConfirm: '&',
      onCancel: '&',
      isOpenModal: '<',
      servicesToAdd: '<',
    },
  })
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
