import angular from 'angular';

// Peer dependencies.
import 'angular-translate';
import '@ovh-ux/ui-kit';

// Components.
import component from './endpoints.component';

// Styles
import './endpoints.scss';

const moduleName = 'ovhManagerCarrierSipEndpoints';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component(component.name, component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
