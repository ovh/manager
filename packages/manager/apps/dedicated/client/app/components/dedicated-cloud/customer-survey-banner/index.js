import customerSurveyBannerComponent from './customer-survey-banner.component';

const moduleName = 'ovhManagerPccDashboardCustomerSurveyBanner';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component(customerSurveyBannerComponent.name, customerSurveyBannerComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
