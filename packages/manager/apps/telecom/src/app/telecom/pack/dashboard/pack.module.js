import angular from 'angular';

import packMove from '../move';
import packResiliation from '../resiliation/pack-resiliation';
import packVoipLineActivation from '../slots/voipLine/activation/pack-voipLine-activation.module';
import packEcoFaxActivation from '../slots/voipEcoFax/activation';
import hostedEmailDetail from '../slots/hostedEmail/detail';
import xdsl from '../xdsl';
import migration from '../migration';
import domainActivation from '../slots/domain/activation';
import hubicActivation from '../slots/hubic/activation';
import emailProAdd from '../slots/emailPro/add';
import emailProDetail from '../slots/emailPro/detail';
import emailPro from '../slots/emailPro';
import exchangeIndividualAdd from '../slots/exchangeIndividual/add';
import exchangeIndividual from '../slots/exchangeIndividual';
import hostedEmailAdd from '../slots/hostedEmail/add';
import hostedEmail from '../slots/hostedEmail';

import templates from './pack.templates';

import controller from './pack.controller';
import routing from './pack.routing';

const moduleName = 'ovhManagerTelecomPack';

angular
  .module(moduleName, [
    hostedEmailDetail,
    packVoipLineActivation,
    packEcoFaxActivation,
    xdsl,
    packMove,
    migration,
    packResiliation,
    domainActivation,
    hubicActivation,
    emailProAdd,
    emailPro,
    emailProDetail,
    exchangeIndividualAdd,
    exchangeIndividual,
    hostedEmail,
    hostedEmailAdd,
  ])
  .controller('PackCtrl', controller)
  .config(routing)
  .run(templates)
  .run(/* @ngTranslationsInject:json ../translations */);

export default moduleName;
