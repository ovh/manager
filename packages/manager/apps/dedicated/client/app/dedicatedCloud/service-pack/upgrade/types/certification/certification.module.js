import certification from '../../../../../components/dedicated-cloud/service-pack/upgrade/types/certification';

import { registerState } from './certification.routing';

const moduleName = 'ovhManagerPccServicePackUpgradeCertification';

angular
  .module(moduleName, [certification])
  .config(registerState)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
