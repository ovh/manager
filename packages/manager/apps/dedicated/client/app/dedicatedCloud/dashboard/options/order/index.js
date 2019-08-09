import {
  ACTIVATION_TYPES,
} from './options.constants';

import component from './options.component';
import confirm from './confirm';
import service from './options.service';
import servicePack from '../servicePack';
import state from './options.state';
import stepper from './stepper';

const componentName = 'dedicatedCloudServicePack';
const constantName = 'DEDICATED_CLOUD_SERVICE_PACK_ACTIVATION';
const moduleName = 'dedicatedCloudDashboardTilesOptionsOrder';
const serviceName = 'orderService';
const stateName = 'app.dedicatedClouds.servicePack';

angular
  .module(moduleName, [
    confirm,
    'oui',
    'pascalprecht.translate',
    servicePack,
    stepper,
    'ui.router',
    ...ACTIVATION_TYPES.all,
  ])
  .component(componentName, component)
  .config(/* @ngInject */ ($stateProvider) => {
    $stateProvider.state(stateName, state);
  })
  .constant(constantName, { ACTIVATION_TYPES })
  .run(/* @ngTranslationsInject:json ./translations */)
  .service(serviceName, service);

export default moduleName;
