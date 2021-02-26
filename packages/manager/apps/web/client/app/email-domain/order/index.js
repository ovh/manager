import ovhManagerOrder from '@ovh-ux/manager-order';

import component from './order.component';
import routing from './order.routing';
import service from './email-domain-order.service';

const moduleName = 'ovhManagerWebEmailDomainOrder';

angular
  .module(moduleName, [
    'oui',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    ovhManagerOrder,
  ])
  .config(routing)
  .component('emailDomainOrder', component)
  .service('MXPlanService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
