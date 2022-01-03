import component from './autoconfigure-dhcp.component';

const moduleName = 'ovhManagerOtbAutoconfigureDhcp';

angular
  .module(moduleName, ['ui.router'])
  .component('otbAutoconfigureDhcp', component);

export default moduleName;
