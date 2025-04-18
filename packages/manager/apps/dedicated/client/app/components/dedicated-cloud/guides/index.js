import component from './dedicatedCloud-guides.component';

const moduleName = 'ovhManagerPccGuides';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component(moduleName, component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
