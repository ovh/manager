import component from './service-pack-picker.component';

const moduleName = 'ovhManagerPccServicePackPicker';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate', 'ui.router'])
  .component(component.name, component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
