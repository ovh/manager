import activationStatus from './components/activation-status';
import descriptionsBasicOption from './descriptions/basic-option';
import descriptionsCertification from './descriptions/certification';
import order from './models/order';
import servicePack from '../../../service-pack';
import upgrade from '../../../service-pack/upgrade';
import user from './models/user';

import component from './options.component';
import {
  name as serviceName,
  OptionsService,
} from './options.service';

const moduleName = 'ovhManagerPccDashboardOptions';

angular
  .module(moduleName, [
    activationStatus,
    descriptionsBasicOption,
    descriptionsCertification,
    order,
    'oui',
    'pascalprecht.translate',
    servicePack,
    'ui.router',
    upgrade,
    user,
  ])
  .component(component.name, component)
  .run(/* @ngTranslationsInject:json ./translations */)
  .service(serviceName, OptionsService);

export default moduleName;
