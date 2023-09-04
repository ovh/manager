import angular from 'angular';

import emailproCtrl from './emailpro.controller';
import emailproTabsAccountCtrl from '../account/emailpro-account.controller';
import emailproAddAccountCtrl from '../account/add/emailpro-account-add.controller';
import emailproTabAliasCtrl from '../account/alias/emailpro-account-alias.controller';
import emailproAddAccountAliasCtrl from '../account/alias/add/emailpro-add-account-alias.controller';
import emailproRemoveAliasCtrl from '../account/alias/remove/emailpro-remove-account-alias.controller';
import emailproTabGroupAliasCtrl from '../account/alias/group/emailpro-group-alias.controller';
import emailproAddGroupAliasCtrl from '../account/alias/group/emailpro-add-group-alias.controller';
import emailproRemoveGroupAliasCtrl from '../account/alias/group/emailpro-remove-group-alias.controller';
import emailproAccountDelegationCtrl from '../account/delegation/emailpro-account-delegation.controller';
import emailproMailingListDelegationCtrl from '../account/delegation/emailpro-account-mailing-list-delegation.controller';
import emailproDelegationSettingsCtrl from '../account/delegation/setting/emailpro-account-delegation-setting.controller';
import emailproOrderAccountCtrl from '../account/order/emailpro-account-order.controller';
import emailproRemoveAccountCtrl from '../account/remove/emailpro-account-remove.controller';
import emailproUpdateAccountCtrl from '../account/update/emailpro-account-update.controller';
import emailproDisclaimerCtrl from '../disclaimer/emailpro-disclaimer.controller';
import emailproAddDisclaimerCtrl from '../disclaimer/add/emailpro-disclaimer-add.controller';
import emailproRemoveDisclaimerCtrl from '../disclaimer/remove/emailpro-disclaimer-remove.controller';
import emailproUpdateDisclaimerCtrl from '../disclaimer/update/emailpro-disclaimer-update.controller';
import emailproTabDomainCtrl from '../domain/emailpro-domain.controller';
import emailproAddDomainCtrl from '../domain/add/emailpro-domain-add.controller';
import emailproDomainMxAutoconfigCtrl from '../domain/mx-autoconfig/emailpro-domain-mx-autoconfig.controller';
import emailproDomainDkimAutoconfigCtrl from '../domain/dkim-autoconfig/emailpro-domain-dkim-autoconfig.controller';
import emailproRemoveDomainCtrl from '../domain/remove/emailpro-domain-remove.controller';
import emailproDomainSrvAutoconfigCtrl from '../domain/srv-autoconfig/emailpro-domain-srv-autoconfig.controller';
import emailproDomainSpfAutoconfigCtrl from '../domain/spf-autoconfig/emailpro-domain-spf-autoconfig.controller';
import emailproUpdateDomainCtrl from '../domain/update/emailpro-domain-update.controller';
import emailproTabExternalContactsCtrl from '../external-contact/emailpro-external-contact-tab.controller';
import emailproAddExternalContactCtrl from '../external-contact/add/emailpro-external-contact-add.controller';
import emailproExternalContactsModifyCtrl from '../external-contact/update/emailpro-external-contact-update.controller';
import emailproExternalContactsDeleteCtrl from '../external-contact/remove/emailpro-external-contact-remove.controller';
import emailproTabInformationCtrl from '../information/emailpro-information-tab';
import emailproLicenseHistoryCtrl from '../license/history/emailpro-license-history.controller';
import emailproMxPlanMailingListsTabsModulesCtrl from '../mailing-list/emailpro-mailing-list-tab-modules.controller';
import emailproMxPlanMailingListsCreateCtrl from '../mailing-list/create/emailpro-mailing-list-create.controller';
import emailproMxPlanMailingListsDeleteCtrl from '../mailing-list/delete/emailpro-mailing-list-delete.controller';
import emailproMxPlanMailingListsDeleteModeratorCtrl from '../mailing-list/moderator/delete/emailpro-mailing-list-moderator-delete.controller';
import emailproMxPlanMailingListsModeratorsCtrl from '../mailing-list/moderators/emailpro-mailing-list-moderators.controller';
import emailproMxPlanMailingListsCreateModeratorCtrl from '../mailing-list/moderators/create/emailpro-mailing-list-moderators-create.controller';
import emailproMxPlanMailingListsCreateModeratorsCtrl from '../mailing-list/moderators/delete/emailpro-mailing-list-moderators-delete.controller';
import emailproMxPlanMailingListsSendListsByEmailCtrl from '../mailing-list/send-list-by-email/emailpro-mailing-list-send-list-by-email.controller';
import emailproMxPlanMailingListsDeleteSubscriberCtrl from '../mailing-list/subscriber/delete/emailpro-mailing-list-subscriber-delete.controller';
import emailproMxPlanMailingListsSubscribersCtrl from '../mailing-list/subscribers/emailpro-mailing-list-subscribers.controller';
import emailproMxPlanMailingListsCreateSubscriberCtrl from '../mailing-list/subscribers/create/emailpro-mailing-list-subscribers-create.controller';
import emailproMxPlanMailingListsDeleteSubscribersCtrl from '../mailing-list/subscribers/delete/emailpro-mailing-list-subscribers-delete.controller';
import emailproMxPlanMailingListsUpdateCtrl from '../mailing-list/update/emailpro-mailing-list-update.controller';
import emailproMxPlanEmailRedirectionCtrl from '../redirection/emailpro-redirection.controller';
import emailproMxPlanCreateRedirectionCtrl from '../redirection/create/email-domain-email-redirection-create.controller';
import emailproMxPlanDeleteRedirectionCtrl from '../redirection/delete/email-domain-email-redirection-delete.controller';
import emailproMxPlanUpdateRedirectionCtrl from '../redirection/update/email-domain-email-redirection-update.controller';
import emailproRemoveEmailProCtrl from '../remove/emailpro-remove.controller';
import emailproServicesConfigureCtrl from '../service/configure/emailpro-service-configure.controller';
import emailproServicesConfigureFormCtrl from '../service/configure/emailpro-service-configure-form.controller';
import emailproTabTasksCtrl from '../task/emailpro-task.controller';
import emailproUpdateRenewCtrl from '../update/renew/emailpro-update-renew.controller';
import emailproToolboxGroupsCtrl from './emailpro-toolbox-groups.controller';
import emailproToolboxResourcesCtrl from './emailpro-toolbox-resources.controller';
import emailproToolboxDisclaimerCtrl from './emailpro-toolbox-disclaimer.controller';

const moduleName = 'Module.emailpro.controllers';

angular
  .module(moduleName, [])
  .controller('EmailProCtrl', emailproCtrl)
  .controller('EmailProTabAccountsCtrl', emailproTabsAccountCtrl)
  .controller('EmailProAddAccountCtrl', emailproAddAccountCtrl)
  .controller('EmailProAddAccountAliasCtrl', emailproAddAccountAliasCtrl)
  .controller('EmailProTabAliasCtrl', emailproTabAliasCtrl)
  .controller('EmailProRemoveAliasCtrl', emailproRemoveAliasCtrl)
  .controller('EmailProTabGroupAliasCtrl', emailproTabGroupAliasCtrl)
  .controller('EmailProAddGroupAliasCtrl', emailproAddGroupAliasCtrl)
  .controller('EmailProRemoveGroupAliasCtrl', emailproRemoveGroupAliasCtrl)
  .controller('EmailProAccountDelegationCtrl', emailproAccountDelegationCtrl)
  .controller(
    'EmailProMailingListDelegationCtrl',
    emailproMailingListDelegationCtrl,
  )
  .controller('EmailProDelegationSettingsCtrl', emailproDelegationSettingsCtrl)
  .controller('EmailProOrderAccountCtrl', emailproOrderAccountCtrl)
  .controller('EmailProRemoveAccountCtrl', emailproRemoveAccountCtrl)
  .controller('EmailProUpdateAccountCtrl', emailproUpdateAccountCtrl)
  .controller('EmailProDisclaimerCtrl', emailproDisclaimerCtrl)
  .controller('EmailProAddDisclaimerCtrl', emailproAddDisclaimerCtrl)
  .controller('EmailProRemoveDisclaimerCtrl', emailproRemoveDisclaimerCtrl)
  .controller('EmailProUpdateDisclaimerCtrl', emailproUpdateDisclaimerCtrl)
  .controller('EmailProTabDomainsCtrl', emailproTabDomainCtrl)
  .controller('EmailProAddDomainController', emailproAddDomainCtrl)
  .controller('EmailProDomainMxAutoconfigCtrl', emailproDomainMxAutoconfigCtrl)
  .controller(
    'EmailProDomainDkimAutoconfigCtrl',
    emailproDomainDkimAutoconfigCtrl,
  )
  .controller('EmailProRemoveDomainCtrl', emailproRemoveDomainCtrl)
  .controller(
    'EmailProDomainSrvAutoconfigCtrl',
    emailproDomainSrvAutoconfigCtrl,
  )
  .controller(
    'EmailProDomainSpfAutoconfigCtrl',
    emailproDomainSpfAutoconfigCtrl,
  )
  .controller('EmailProUpdateDomainCtrl', emailproUpdateDomainCtrl)
  .controller(
    'EmailProTabExternalContactsCtrl',
    emailproTabExternalContactsCtrl,
  )
  .controller('EmailProAddExternalContactCtrl', emailproAddExternalContactCtrl)
  .controller(
    'EmailProExternalContactsModifyCtrl',
    emailproExternalContactsModifyCtrl,
  )
  .controller(
    'EmailProExternalContactsDeleteCtrl',
    emailproExternalContactsDeleteCtrl,
  )
  .controller('EmailProTabInformationCtrl', emailproTabInformationCtrl)
  .controller('EmailProLicenseHistoryCtrl', emailproLicenseHistoryCtrl)
  .controller(
    'EmailMXPlanEmailRedirectionCtrl',
    emailproMxPlanEmailRedirectionCtrl,
  )
  .controller(
    'EmailMXPlanCreateRedirectionCtrl',
    emailproMxPlanCreateRedirectionCtrl,
  )
  .controller(
    'EmailMXPlanDeleteRedirectionCtrl',
    emailproMxPlanDeleteRedirectionCtrl,
  )
  .controller(
    'EmailMXPlanUpdateRedirectionCtrl',
    emailproMxPlanUpdateRedirectionCtrl,
  )
  .controller('EmailProServicesConfigureCtrl', emailproServicesConfigureCtrl)
  .controller(
    'EmailProServicesConfigureFormCtrl',
    emailproServicesConfigureFormCtrl,
  )
  .controller(
    'EmailProMXPlanMailingListsTabModulesCtrl',
    emailproMxPlanMailingListsTabsModulesCtrl,
  )
  .controller(
    'EmailProMXPlanMailingListsCreateCtrl',
    emailproMxPlanMailingListsCreateCtrl,
  )
  .controller(
    'EmailProMXPlanMailingListsDeleteCtrl',
    emailproMxPlanMailingListsDeleteCtrl,
  )
  .controller(
    'EmailProMXPlanMailingListsDeleteModeratorCtrl',
    emailproMxPlanMailingListsDeleteModeratorCtrl,
  )
  .controller(
    'EmailProMXPlanMailingListsModeratorsCtrl',
    emailproMxPlanMailingListsModeratorsCtrl,
  )
  .controller(
    'EmailProMXPlanMailingListsCreateModeratorCtrl',
    emailproMxPlanMailingListsCreateModeratorCtrl,
  )
  .controller(
    'EmailProMXPlanMailingListsCreateModeratorsCtrl',
    emailproMxPlanMailingListsCreateModeratorsCtrl,
  )
  .controller(
    'EmailProMXPlanMailingListsSendListByEmailCtrl',
    emailproMxPlanMailingListsSendListsByEmailCtrl,
  )
  .controller(
    'EmailProMXPlanMailingListsDeleteSubscriberCtrl',
    emailproMxPlanMailingListsDeleteSubscriberCtrl,
  )
  .controller(
    'EmailProMXPlanMailingListsSubscribersCtrl',
    emailproMxPlanMailingListsSubscribersCtrl,
  )
  .controller(
    'EmailProMXPlanMailingListsCreateSubscriberCtrl',
    emailproMxPlanMailingListsCreateSubscriberCtrl,
  )
  .controller(
    'EmailProMXPlanMailingListsDeleteSubscribersCtrl',
    emailproMxPlanMailingListsDeleteSubscribersCtrl,
  )
  .controller(
    'EmailProMXPlanMailingListsUpdateCtrl',
    emailproMxPlanMailingListsUpdateCtrl,
  )
  .controller('EmailProRemoveEmailProCtrl', emailproRemoveEmailProCtrl)
  .controller('EmailProTabTasksCtrl', emailproTabTasksCtrl)
  .controller('EmailProUpdateRenewCtrl', emailproUpdateRenewCtrl)
  .controller('EmailProToolboxGroupsCtrl', emailproToolboxGroupsCtrl)
  .controller('EmailProToolboxResourcesCtrl', emailproToolboxResourcesCtrl)
  .controller('EmailProToolboxDisclaimerCtrl', emailproToolboxDisclaimerCtrl);

export default moduleName;
