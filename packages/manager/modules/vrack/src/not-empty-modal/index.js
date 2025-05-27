import angular from 'angular';

import template from './template.html';

const moduleName = 'ovhManagerVrackNotEmptyModal';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component('vrackNotEmptyModal', {
    template,
    bindings: {
      goBack: '<',
      serviceName: '<',
    },
  })
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
