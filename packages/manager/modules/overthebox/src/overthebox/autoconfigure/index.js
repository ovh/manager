import component from './overTheBox-autoconfigure.component';
import routing from './overTheBox-autoconfigure.routing';

import dhcp from './dhcp';
import firewall from './firewall';

import multipath from './multipath';

const moduleName = 'ovhManagerOtbAutoconfigure';

angular
  .module(moduleName, [
    'ui.router',
    'ovh-api-services',
    dhcp,
    firewall,
    multipath,
  ])
  .component('overTheBoxAutoconfigure', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
