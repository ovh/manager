import angular from 'angular';
import 'angular-translate';
import terminate from '../../components/terminate';
import routing from './terminate.routing';

const moduleName = 'ovhManagerWebPaasProjectsTerminate';

angular
  .module(moduleName, [terminate, 'pascalprecht.translate'])
  .config(routing);

export default moduleName;
