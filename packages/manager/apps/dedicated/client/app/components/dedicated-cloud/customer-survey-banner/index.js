import component from './customer-survey-banner.component';

const moduleName = 'ovhManagerPccDashboardCustomerSurveyBanner';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component(component.name, component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
