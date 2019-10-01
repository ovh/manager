import angular from 'angular';
import uiRouter from '@uirouter/angularjs';

import 'ovh-api-services';

import WucProducts from './product.service';

import WucAllDom from '../alldom';
import WucEmails from '../email-domain';

const moduleName = 'wucProduct';

angular
  .module(moduleName, [
    'ovh-api-services',
    uiRouter,
    WucAllDom,
    WucEmails,
  ])
  .service('WucProducts', WucProducts);

export default moduleName;
