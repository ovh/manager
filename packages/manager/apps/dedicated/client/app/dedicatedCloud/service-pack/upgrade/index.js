import basicOptions from './types/basicOptions';
import certification from './types/certification';
import configurationOnly from './types/configuration-only';

import servicePack from '..';
import stepper from '../../../components/stepper';

import component from './upgrade.component';
import { registerState } from './upgrade.routing';
import { name as serviceName, UpgradeService } from './upgrade.service';

const moduleName = 'ovhManagerPccServicePackUpgrade';

angular
  .module(moduleName, [
    basicOptions,
    certification,
    configurationOnly,
    'pascalprecht.translate',
    servicePack,
    stepper,
    'ui.router',
  ])
  .component(component.name, component)
  .config(registerState)
  .run(/* @ngTranslationsInject:json ./translations */)
  .service(serviceName, UpgradeService);

export default moduleName;
