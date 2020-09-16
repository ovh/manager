import angular from 'angular';

import contactsChoice from './contacts-choice/contacts-choice.component';
import receiversChoice from './receivers-choice/receivers-choice.component';
import smsComposition from './sms-composition/sms-composition.component';
import smsConfiguration from './sms-configuration/sms-configuration.component';
import smsCredits from './sms-credits/sms-credits.component';
import smsEstimate from './sms-estimate/sms-estimate.component';
import smsOptions from './sms-options/sms-options.component';
import smsTips from './sms-tips/sms-tips.component';
import smsTipsCompose from './sms-tips/compose/sms-tips-compose.component';
import smsTipsSize from './sms-tips/size/sms-tips-size.component';

import './components.scss';

const moduleName = 'ovhManagerSmsComponents';

angular
  .module(moduleName, [])
  .component(contactsChoice.name, contactsChoice)
  .component(receiversChoice.name, receiversChoice)
  .component(smsComposition.name, smsComposition)
  .component(smsConfiguration.name, smsConfiguration)
  .component(smsCredits.name, smsCredits)
  .component(smsEstimate.name, smsEstimate)
  .component(smsOptions.name, smsOptions)
  .component(smsTips.name, smsTips)
  .component(smsTipsCompose.name, smsTipsCompose)
  .component(smsTipsSize.name, smsTipsSize);

export default moduleName;
