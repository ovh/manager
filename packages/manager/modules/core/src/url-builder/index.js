import angular from 'angular';
import coreConfig from '../config';

import provider from './url-builder.provider';

const moduleName = 'coreURLBuilder';

angular.module(moduleName, [coreConfig]).provider('coreURLBuilder', provider);

export default moduleName;
