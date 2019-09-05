import component from './options.component';
import {
  name as serviceName,
  OvhManagerPccDashboardOptions as service,
} from './options.service';

import activationStatus from './activationStatus';
import order from './order';
import preference from './preference';
import servicePack from './servicePack';

const moduleName = 'ovhManagerPccDashboardOptions';

angular
  .module(moduleName, [
    activationStatus,
    order,
    'oui',
    'pascalprecht.translate',
    preference,
    servicePack,
    'ui.router',
  ])
  .component(component.name, component)
  .run(/* @ngTranslationsInject:json ./translations */)
  .service(serviceName, service);

export default moduleName;
