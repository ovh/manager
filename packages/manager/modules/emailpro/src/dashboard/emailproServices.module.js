import angular from 'angular';
import ovhManagerCore from '@ovh-ux/manager-core';

import emailproService from './emailpro.service';
import ApiEmailPro from '../api/emailpro-api.service';
import EmailProDomains from '../domain/emailpro-domain.service';
import EmailProExternalContacts from '../external-contact/emailpro-external-contact.service';
import EmailProPassword from '../password/emailpro-password.service';
import EmailproMxPlanMailingLists from '../mailing-list/emailpro-mailing-list.service';

const moduleName = 'Module.emailpro.services';

angular
  .module(moduleName, [ovhManagerCore])
  .service('EmailPro', emailproService)
  .service('APIEmailPro', ApiEmailPro)
  .service('EmailProDomains', EmailProDomains)
  .service('EmailProExternalContacts', EmailProExternalContacts)
  .service('EmailProPassword', EmailProPassword)
  .service('EmailProMXPlanMailingLists', EmailproMxPlanMailingLists);

export default moduleName;
