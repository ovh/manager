import ovhManagerAdvices from '@ovh-ux/manager-advices';

import controller from './GENERAL_INFORMATIONS.controller';
import routing from './general-informations.routing';

import cdnTerminate from '../cdn/terminate';

const moduleName = 'ovhManagerHostingGeneralInformations';

angular
  .module(moduleName, [ovhManagerAdvices, cdnTerminate])
  .controller('hostingGeneralInformationsCtrl', controller)
  .run(/* @ngTranslationsInject:json ./translations */)
  .run(/* @ngTranslationsInject:json ../translations */)
  .config(routing);

export default moduleName;
