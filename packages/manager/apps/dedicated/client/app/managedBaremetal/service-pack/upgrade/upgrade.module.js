import basicOptions from './types/basicOptions';
import certification from './types/certification';
import configurationOnly from './types/configuration-only';

import servicePack from '../../../components/dedicated-cloud/service-pack';
import stepper from '../../../components/stepper';
import upgradeModule from '../../../components/dedicated-cloud/service-pack/upgrade';

import { registerState } from './upgrade.routing';

const moduleName = 'managedBaremetalServicePackUpgrade';

angular
  .module(moduleName, [
    basicOptions,
    certification,
    configurationOnly,
    'pascalprecht.translate',
    servicePack,
    stepper,
    'ui.router',
    upgradeModule,
  ])
  .config(registerState);

export default moduleName;
