import angular from 'angular';
import packVoipLineActivation from './voipLine/activation/pack-voipLine-activation.module';
import packEcoFaxActivation from './voipEcoFax/activation';
import hostedEmailDetail from './hostedEmail/detail';
import domainActivation from './domain/activation';
import hubicActivation from './hubic/activation';
import emailProAdd from './emailPro/add';
import emailProDetail from './emailPro/detail';
import emailPro from './emailPro';
import exchangeIndividualAdd from './exchangeIndividual/add';
import exchangeIndividual from './exchangeIndividual';
import hostedEmailAdd from './hostedEmail/add';
import hostedEmail from './hostedEmail';
import packDomain from './domain';
import packExchangeAccount from './exchangeAccount';
import packExchangeLite from './exchangeLite';
import hubic from './hubic';
import packInformation from './informations';
import promotionCode from './promotionCode';
import task from './task';
import voipBillingAccount from './voipBillingAccount';
import voipEcoFax from './voipEcoFax';
import voipLine from './voipLine';
import xdslAccess from './xdslAccess';

const moduleName = 'ovhManagerTelecomPackSlots';

angular
  .module(moduleName, [
    domainActivation,
    emailPro,
    emailProAdd,
    emailProDetail,
    exchangeIndividual,
    exchangeIndividualAdd,
    hostedEmail,
    hostedEmailAdd,
    hostedEmailDetail,
    hubic,
    hubicActivation,
    packDomain,
    packEcoFaxActivation,
    packExchangeAccount,
    packExchangeLite,
    packInformation,
    packVoipLineActivation,
    promotionCode,
    task,
    voipBillingAccount,
    voipEcoFax,
    voipLine,
    xdslAccess,
  ])
  .run(/* @ngTranslationsInject:json ../translations */);

export default moduleName;
