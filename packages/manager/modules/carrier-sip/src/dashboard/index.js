import angular from 'angular';

// Peer dependencies.
import 'angular-translate';
import 'ovh-ui-angular';

// Components.
import component from './dashboard.component';

// Styles.
import 'ovh-ui-kit-bs/dist/ovh-ui-kit-bs.css';
import './index.scss';

const moduleName = 'ovhManagerCarrierSipDashboard';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component('carrierSipDashboard', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
