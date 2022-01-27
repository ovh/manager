import component from './autoconfigure-dhcp.component';

const moduleName = 'ovhManagerOtbAutoconfigureDhcp';

angular
  .module(moduleName, ['ui.router'])
  .component('overTheBoxAutoconfigureDhcp', component);

export default moduleName;
