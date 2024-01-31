import component from './mxplan-banner.component';

const moduleName = 'ovhManagermxplanBanner';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component(component.name, component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
