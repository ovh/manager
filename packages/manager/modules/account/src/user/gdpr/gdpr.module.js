import component from './gdpr.component';
import routing from './gdpr.routing';
import service from './gdpr.service';
import confirmModule from './confirm';

import './gdpr.scss';

const moduleName = 'ovhManagerAccountGdprModule';

angular
  .module(moduleName, [confirmModule])
  .config(routing)
  .component('gdprFeatures', component)
  .service('gdprService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
