import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import routing from './license-spla-add.routes';

const moduleName = 'licenseModuleSplaAdd';

angular
  .module(moduleName, [uiRouter, 'oui', 'pascalprecht.translate'])
  .config(routing);

export default moduleName;
