import angular from 'angular';
import 'angular-translate';

import routing from './add-addon.routing';
import component from '../../../components/addon';

const moduleName = 'ovhManagerWebPaasDetailsServiceAddAddon';

angular
  .module(moduleName, ['pascalprecht.translate', component])
  .config(routing);

export default moduleName;
