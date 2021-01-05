import ovhManagerAdvices from '@ovh-ux/manager-advices';

import controller from './GENERAL_INFORMATIONS.controller';

const moduleName = 'ovhManagerHostingGeneralInformations';

angular
  .module(moduleName, [ovhManagerAdvices])
  .controller('hostingGeneralInformationsCtrl', controller);

export default moduleName;
