import component from './private-config-funnel.component';
import routing from './private-config-funnel.routing';
import service from './private-config-funnel.service';

const moduleName = 'exchangePrivateConfigFunnel';

angular
  .module(moduleName, [])
  .component('exchangePrivateConfigFunnelComponent', component)
  .service('ExchangePrivateConfigFunnelService', service)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
