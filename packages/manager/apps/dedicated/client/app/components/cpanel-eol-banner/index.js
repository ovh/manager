import component from './cpanel-eol-banner.component';

const moduleName = 'ovhManagerCpanelEolBannerModule';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component(component.name, component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
