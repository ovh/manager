import angular from 'angular';
import '@ovh-ux/ui-kit';

import component from './connector-input.component';

import connectorTransformInput from '../connector-transform-input';
import connectorExtraInput from '../connector-extra-input';

const moduleName = 'ovhManagerPciStoragesDatabasesConnectorInput';

angular
  .module(moduleName, ['oui', connectorTransformInput, connectorExtraInput])
  .component('connectorInput', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
