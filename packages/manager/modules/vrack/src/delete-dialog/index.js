import angular from 'angular';

import template from './template.html';

const moduleName = 'ovhManagerVrackDeleteDialogModal';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component('vrackDeleteDialogModal', {
    template,
    bindings: {
      onConfirm: '&',
      onCancel: '&',
      isOpenModal: '<',
      servicesToDelete: '<',
    },
  })
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
