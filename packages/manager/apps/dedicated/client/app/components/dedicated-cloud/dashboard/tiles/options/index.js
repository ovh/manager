import activationStatus from './components/activation-status';
import bindings from './models/bindings/bindings';
import component from './options.component';
import descriptionsBasicOption from './descriptions/basic-option';
import descriptionsCertification from './descriptions/certification';
import drp from '../../../datacenter/drp';
import nsxt from './components/nsxt';
import logs from './components/logs';
import optionsService from './options.service';
import order from './models/order';
import servicePack from '../../../service-pack';
import user from './models/user';

const moduleName = 'ovhManagerPccDashboardOptions';

angular
  .module(moduleName, [
    activationStatus,
    bindings,
    descriptionsBasicOption,
    descriptionsCertification,
    drp,
    nsxt,
    logs,
    optionsService,
    order,
    'oui',
    'pascalprecht.translate',
    servicePack,
    'ui.router',
    // upgrade,
    user,
  ])
  .component(component.name, component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
