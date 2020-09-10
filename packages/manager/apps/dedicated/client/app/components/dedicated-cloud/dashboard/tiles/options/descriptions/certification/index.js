import component from './certification.component';

const moduleName = 'ovhManagerPccDashboardOptionsDescriptionsCertification';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate', 'ui.router'])
  .component(component.name, component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
