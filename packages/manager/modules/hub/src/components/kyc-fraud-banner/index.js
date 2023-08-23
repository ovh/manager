import component from './kyc-fraud-banner.component';

const moduleName = 'ovhManagerKycFraudBanner';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate', 'ui.router'])
  .component(component.name, component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
