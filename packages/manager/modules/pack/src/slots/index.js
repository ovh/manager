import angular from 'angular';

import domain from './domain';
import emailPro from './emailPro';
import exchangeAccount from './exchangeAccount';
import exchangeIndividual from './exchangeIndividual';
import exchangeLite from './exchangeLite';
import hostedEmail from './hostedEmail';
import hubic from './hubic';
import informations from './informations';
import promotionCode from './promotionCode';
import task from './task';
import voipBillingAccount from './voipBillingAccount';
import voipEcoFax from './voipEcoFax';
import voipLine from './voipLine';
import xdslAccess from './xdslAccess';

const moduleName = 'ovhManagerPackSlots';

angular
  .module(moduleName, [
    domain,
    emailPro,
    exchangeAccount,
    exchangeIndividual,
    exchangeLite,
    hostedEmail,
    hubic,
    informations,
    promotionCode,
    task,
    voipBillingAccount,
    voipEcoFax,
    voipLine,
    xdslAccess,
  ]);

export default moduleName;
