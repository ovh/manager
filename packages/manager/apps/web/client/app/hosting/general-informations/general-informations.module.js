import controller from './GENERAL_INFORMATIONS.controller';
import hostingAdvices from '../advices';

const moduleName = 'ovhManagerHostingGeneralInformations';

angular
  .module(moduleName, [hostingAdvices])
  .controller('hostingGeneralInformationsCtrl', controller);

export default moduleName;
