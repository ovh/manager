import durationStep from './duration/domain-webhosting-order-steps-duration.component';
import dnsConfigurationStep from './dnsConfiguration/domain-webhosting-order-steps-dnsConfiguration.component';
import hostingStep from './hosting/domain-webhosting-order-steps-hosting.component';
import moduleStep from './module/domain-webhosting-order-steps-module.component';
import paymentStep from './payment/domain-webhosting-order-steps-payment.component';

import component from './domain-webhosting-order-steps.component';

const moduleName = 'ovhManagerWebDomainWebhostingOrderStepsModule';

angular
  .module(moduleName, [])
  .component(component.name, component)
  .component(dnsConfigurationStep.name, dnsConfigurationStep)
  .component(durationStep.name, durationStep)
  .component(hostingStep.name, hostingStep)
  .component(moduleStep.name, moduleStep)
  .component(paymentStep.name, paymentStep)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
