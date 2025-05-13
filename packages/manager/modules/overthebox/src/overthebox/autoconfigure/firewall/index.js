import component from './autoconfigure-firewall.component';
import constant from './autoconfigure-firewall.constant';

const moduleName = 'ovhManagerOtbAutoconfigureFirewall';

angular
  .module(moduleName, ['ui.router'])
  .component('overTheBoxAutoconfigureFirewall', component)
  .constant('OVERTHEBOX_FIREWALL', constant);

export default moduleName;
