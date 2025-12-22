import customerVcfaasMIgrationBannerComponent from './customer-vcfaas-migration-banner.component';

const moduleName = 'ovhManagerPccDashboardCustomerVcfaasMigrationBanner';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component(
    customerVcfaasMIgrationBannerComponent.name,
    customerVcfaasMIgrationBannerComponent,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
