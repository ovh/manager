<% const pascalcasedName = this.camelcase(name, { pascalCase: true }) -%>
<% const componentName = this.camelcase(name, { pascalCase: false }) -%>
import angular from 'angular';
import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'angular-translate';

import component from './component';
import routing from './routing';

const moduleName = 'ovhManager<%= pascalcasedName %>Dashboard';

angular
  .module(moduleName, ['ovhManagerCore', 'pascalprecht.translate', 'ui.router'])
  .config(routing)
  .component('<%= componentName %>', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
