import steps from './certification.steps';

import {
  name as serviceName,
  UpgradeCertificationService,
} from './certification.service';

const moduleName = 'ovhManagerPccServicePackUpgradeCertificationComponent';

angular
  .module(moduleName, [...steps])
  .run(/* @ngTranslationsInject:json ./translations */)
  .service(serviceName, UpgradeCertificationService);

export default moduleName;
