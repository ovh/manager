import angular from 'angular';
import 'angular-translate';
import routing from './add.routing';
import component from './add.component';
import offerComponent from '../components/offers';
import projectTemplateComponent from '../components/project-template';
import additionalOptionComponent from '../components/additional-option';
import summaryComponent from '../components/summary';

const moduleName = 'ovhManagerWebPaasAdd';

angular
  .module(moduleName, [
    offerComponent,
    projectTemplateComponent,
    additionalOptionComponent,
    summaryComponent,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .component('webPaasAddComponent', component);

export default moduleName;
