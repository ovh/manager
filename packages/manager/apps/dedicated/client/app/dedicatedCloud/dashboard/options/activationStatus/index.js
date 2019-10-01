import component from './activationStatus.component';

const moduleName = 'ovhManagerComponentActivationStatus';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
  ])
  .component(component.name, component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
