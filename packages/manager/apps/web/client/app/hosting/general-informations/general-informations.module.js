import controller from './GENERAL_INFORMATIONS.controller';

const moduleName = 'ovhManagerHostingGeneralInformations';

angular
  .module(moduleName, [])
  .controller('hostingGeneralInformationsCtrl', controller);

export default moduleName;
