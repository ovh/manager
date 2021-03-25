import routing from './ip-dashboard.routing';

import antispam from './antispam/antispam.module';
import firewall from './firewall/firewall.module';
import organisation from './organisation/organisation.module';
import order from './agoraOrder/agoraOrder.module';

const moduleName = 'ovhManagerIpDashboard';

angular
  .module(moduleName, [antispam, firewall, order, organisation])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .run(/* @ngTranslationsInject:json ./reverse/update/translations */);

export default moduleName;
