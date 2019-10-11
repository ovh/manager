import steps from './certification.steps';

import { registerState } from './certification.routing';
import {
  name as serviceName,
  UpgradeCertificationService,
} from './certification.service';

const moduleName = 'ovhManagerPccServicePackUpgradeCertification';

angular
  .module(moduleName, [
    ...steps,
  ])
  .config(registerState)
  .run(/* @ngTranslationsInject:json ./translations */)
  .service(serviceName, UpgradeCertificationService);

export default moduleName;
