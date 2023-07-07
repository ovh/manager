import component from './spf-banner.component';

const moduleName = 'ovhManagerWucSpfBanner';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component(component.name, component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
