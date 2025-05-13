import component from './auto-renew-2016-deployment-banner.component';

const moduleName = 'ovhManagerAutoRenew2016DeploymentBanner';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate', 'ui.router'])
  .component(component.name, component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
