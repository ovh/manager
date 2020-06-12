import angular from 'angular';

// Peer dependencies.
import 'angular-translate';
import '@ovh-ux/ui-kit';

// Components.
import component from './dashboard.component';

// Styles.
import 'ovh-ui-kit-bs/dist/css/oui-bs3.css';
import './index.scss';

const moduleName = 'ovhManagerCarrierSipDashboard';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component('carrierSipDashboard', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
