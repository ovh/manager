import ovhManagerAdvices from '@ovh-ux/manager-advices';

import controller from './GENERAL_INFORMATIONS.controller';

const moduleName = 'ovhManagerHostingGeneralInformations';

angular
  .module(moduleName, [hostingAdvices])
  .controller('hostingGeneralInformationsCtrl', controller)
  .run(/* @ngTranslationsInject:json ./translations */)
  .run(/* @ngTranslationsInject:json ../translations */);

export default moduleName;
