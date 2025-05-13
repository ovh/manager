import durationStep from './duration/domain-webhosting-order-steps-duration.component';
import dnsConfigurationStep from './dnsConfiguration/domain-webhosting-order-steps-dnsConfiguration.component';
import hostingStep from './hosting/domain-webhosting-order-steps-hosting.component';
import moduleStep from './module/domain-webhosting-order-steps-module.component';
import hostingDomainOffers from '../../../../components/hosting-domain-offers';

import component from './domain-webhosting-order-steps.component';

const moduleName = 'ovhManagerWebDomainWebhostingOrderStepsModule';

angular
  .module(moduleName, [hostingDomainOffers])
  .component(component.name, component)
  .component(dnsConfigurationStep.name, dnsConfigurationStep)
  .component(durationStep.name, durationStep)
  .component(hostingStep.name, hostingStep)
  .component(moduleStep.name, moduleStep)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
