import angular from 'angular';
import 'angular-translate';

import routing from './delete-user.routing';
import component from '../../../../components/delete-user';

const moduleName = 'ovhManagerWebPaasDetailsServiceChangeOfferDeleteUser';

angular
  .module(moduleName, ['pascalprecht.translate', component])
  .config(routing);

export default moduleName;
