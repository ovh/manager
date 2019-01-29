import angular from 'angular';

import domain from './domain';
import exchangeAccount from './exchangeAccount';
import hubic from './hubic';
import informations from './informations';
import task from './task';
import voipLine from './voipLine';
import xdslAccess from './xdslAccess';

const moduleName = 'ovhManagerPackSlots';

angular
  .module(moduleName, [
    domain,
    exchangeAccount,
    hubic,
    informations,
    task,
    voipLine,
    xdslAccess,
  ]);

export default moduleName;
