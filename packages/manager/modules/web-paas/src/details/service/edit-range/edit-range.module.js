import angular from 'angular';
import 'angular-translate';
import modify from '../../../components/modify-plan';
import routing from './edit-range.routing';

const moduleName = 'ovhManagerWebPaasDetailsServiceEditRange';

angular.module(moduleName, [modify, 'pascalprecht.translate']).config(routing);

export default moduleName;
