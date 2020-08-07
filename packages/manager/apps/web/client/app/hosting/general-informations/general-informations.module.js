import controller from './GENERAL_INFORMATIONS.controller';

import routing from './general-informations.routing';

const moduleName = 'ovhManagerHostingGeneralInformations';

angular
  .module(moduleName, [])
  .controller('hostingGeneralInformationsCtrl', controller)
  .config(routing);

export default moduleName;
