import orderTemplate from '../order/order.html';
import serviceSslRenewTemplate from '../information/ssl/service-ssl-renew.html';
import ServiceMigration2016Template from '../information/migration-2016/service-migration-2016.html';
import informationTemplate from '../information/information.html';
import serviceDiskOrderSpaceTemplate from '../information/disk/service-disk-order-space.html';
import disclaimerRemoveTemplate from '../disclaimer/remove/disclaimer-remove.html';
import disclaimerUpdateTemplate from '../disclaimer/update/disclaimer-update.html';
import disclaimerTemplate from '../disclaimer/disclaimer.html';
import disclaimerAddTemplate from '../disclaimer/add/disclaimer-add.html';
import groupAliasRemoveTemplate from '../group/alias/remove/group-alias-remove.html';
import groupAliasTemplate from '../group/alias/group-alias.html';
import groupAliasAddTemplate from '../group/alias/add/group-alias-add.html';
import groupRemoveTemplate from '../group/remove/group-remove.html';
import groupUpdateTemplate from '../group/update/group-update.html';
import groupTemplate from '../group/group.html';
import groupMemberRemoveTemplate from '../group/member/remove/group-member-remove.html';
import groupMemberTemplate from '../group/member/group-member.html';
import groupDelegationTemplate from '../group/delegation/group-delegation.html';
import groupManagerRemoveTemplate from '../group/manager/remove/group-manager-remove.html';
import groupManagerTemplate from '../group/manager/group-manager.html';
import groupAddTemplate from '../group/add/group-add.html';
import groupAccountsTemplate from '../group/accounts/group-accounts.html';
import diagnosticTemplate from '../diagnostic/diagnostic.html';
import diagnosticErrorConnectiveOwaTemplate from '../diagnostic/error/diagnostic-error-connective-owa.html';
import diagnosticErrorIsLockedTemplate from '../diagnostic/error/diagnostic-error-is-locked.html';
import diagnosticErrorIsSpammerTemplate from '../diagnostic/error/diagnostic-error-is-spammer.html';
import diagnosticErrorIsSrvValidTemplate from '../diagnostic/error/diagnostic-error-is-srv-valid.html';
import diagnosticErrorCanReceiveEmailTemplate from '../diagnostic/error/diagnostic-error-can-receive-email.html';
import diagnosticErrorIsSuspendedTemplate from '../diagnostic/error/diagnostic-error-is-suspended.html';
import diagnosticErrorIsMxValidTemplate from '../diagnostic/error/diagnostic-error-is-mx-valid.html';
import diagnosticErrorCanSendEmailTemplate from '../diagnostic/error/diagnostic-error-can-send-email.html';
import sharedAccountTemplate from '../shared-account/shared-account.html';
import sharedAccountUpdateTemplate from '../shared-account/update/shared-account-update.html';
import sharedAccountDeleteTemplate from '../shared-account/delete/shared-account-delete.html';
import sharedAccountDelegationTemplate from '../shared-account/delegation/shared-account-delegation.html';
import sharedAccountAddTemplate from '../shared-account/add/shared-account-add.html';
import sharedRemoveTemplate from '../shared/remove/shared-remove.html';
import sharedUpdateTemplate from '../shared/update/shared-update.html';
import sharedTemplate from '../shared/shared.html';
import sharedPopoverTemplate from '../shared/popover/shared-popover.html';
import sharedAddTemplate from '../shared/add/shared-add.html';
import sharedPermissionRemoveTemplate from '../shared/permission/remove/shared-permission-remove.html';
import sharedPermissionUpdateTemplate from '../shared/permission/update/shared-permission-update.html';
import sharedPermissionTemplate from '../shared/permission/shared-permission.html';
import wizardHostedCreationTemplate from '../wizard-hosted-creation/wizard-hosted-creation.html';
import firstStepTemplate from '../wizard-hosted-creation/first-step/first-step.html';
import updateTemplate from '../wizard-hosted-creation/first-step/email-creation/update/update.html';
import deleteTemplate from '../wizard-hosted-creation/first-step/email-creation/delete/delete.html';
import addTemplate from '../wizard-hosted-creation/first-step/email-creation/add/add.html';
import emailCreationTemplate from '../wizard-hosted-creation/first-step/email-creation/email-creation.html';
import domainConfigurationTemplate from '../wizard-hosted-creation/first-step/domain-configuration/domain-configuration.html';
import firstStepHeaderTemplate from '../wizard-hosted-creation/first-step/header/header.html';
import automaticTemplate from '../wizard-hosted-creation/summary/automatic/automatic.html';
import manualTemplate from '../wizard-hosted-creation/summary/manual/manual.html';
import summaryTemplate from '../wizard-hosted-creation/summary/summary.html';
import externalContactRemoveTemplate from '../external-contact/remove/external-contact-remove.html';
import externalContactTemplate from '../external-contact/external-contact.html';
import externalContactUpdateTemplate from '../external-contact/update/external-contact-update.html';
import externalContactAddTemplate from '../external-contact/add/external-contact-add.html';
import taskTemplate from '../task/task.html';
import officeAttachDialogTemplate from '../office-attach/dialog/office-attach-dialog.html';
import officeAttachTemplate from '../office-attach/office-attach.html';
import accountOrderTemplate from '../account/order/account-order.html';
import accountHomeTemplate from '../account/home/account-home.html';
import accountAliasRemoveTemplate from '../account/alias/remove/account-alias-remove.html';
import accountAliasTemplate from '../account/alias/account-alias.html';
import accountAliasAddTemplate from '../account/alias/add/account-alias-add.html';
import accountRemoveTemplate from '../account/remove/account-remove.html';
import accountUpdateTemplate from '../account/update/account-update.html';
import accountTemplate from '../account/account.html';
import accountDelegationTemplate from '../account/delegation/account-delegation.html';
import accountExportAsCsvTemplate from '../account/export-as-csv/account-export-as-csv.html';
import accountAddTemplate from '../account/add/account-add.html';
import accountUpgrade300gTemplate from '../account/upgrade-300g/account-upgrade-300g.html';
import accountExportAsPstTemplate from '../account/export-as-pst/account-export-as-pst.html';
import accountOutlookDeleteTemplate from '../account/outlook/delete/account-outlook-delete.html';
import accountOutlookTemplate from '../account/outlook/account-outlook.html';
import accountOutlookAddTemplate from '../account/outlook/add/account-outlook-add.html';
import accountOutlookDeactivateTemplate from '../account/outlook/deactivate/account-outlook-deactivate.html';
import accountOutlookActivateTemplate from '../account/outlook/activate/account-outlook-activate.html';
import accountMfaTemplate from '../account/mfa/account-mfa.html';
import accountMfaBulkCreateTemplate from '../account/mfa/bulk-create.html';
import accountMfaBulkDeleteTemplate from '../account/mfa/bulk-delete.html';
import errorMessagesPopoverTemplate from './error-messages.popover.html';
import resourceRemoveTemplate from '../resource/remove/resource-remove.html';
import resourceUpdateTemplate from '../resource/update/resource-update.html';
import resourceTemplate from '../resource/resource.html';
import resourceDelegationTemplate from '../resource/delegation/resource-delegation.html';
import resourceAddTemplate from '../resource/add/resource-add.html';
import domainMxAutoconfigTemplate from '../domain/mx-autoconfig/domain-mx-autoconfig.html';
import domainRemoveTemplate from '../domain/remove/domain-remove.html';
import domainUpdateTemplate from '../domain/update/domain-update.html';
import domainSrvAutoconfigTemplate from '../domain/srv-autoconfig/domain-srv-autoconfig.html';
import domainAddTemplate from '../domain/add/domain-add.html';
import domainTemplate from '../domain/domain.html';
import exchangeRemoveTemplate from '../header/remove/exchange-remove.html';
import serviceLicenseHistoryTemplate from '../header/license/service-license-history.html';
import headerTemplate from '../header/header.html';
import billingAccountRenewTemplate from '../billing/account-renew/renew.html';
import exchangeTemplate from './exchange.html';
import securityTemplate from '../security/security.html';

export default /* @ngInject */ ($templateCache) => {
  $templateCache.put('exchange/order/order.html', orderTemplate);
  $templateCache.put(
    'exchange/information/ssl/service-ssl-renew.html',
    serviceSslRenewTemplate,
  );
  $templateCache.put(
    'exchange/information/migration-2016/service-migration-2016.html',
    ServiceMigration2016Template,
  );
  $templateCache.put(
    'exchange/information/information.html',
    informationTemplate,
  );
  $templateCache.put(
    'exchange/information/disk/service-disk-order-space.html',
    serviceDiskOrderSpaceTemplate,
  );
  $templateCache.put(
    'exchange/disclaimer/remove/disclaimer-remove.html',
    disclaimerRemoveTemplate,
  );
  $templateCache.put(
    'exchange/disclaimer/update/disclaimer-update.html',
    disclaimerUpdateTemplate,
  );
  $templateCache.put('exchange/disclaimer/disclaimer.html', disclaimerTemplate);
  $templateCache.put(
    'exchange/disclaimer/add/disclaimer-add.html',
    disclaimerAddTemplate,
  );
  $templateCache.put(
    'exchange/group/alias/remove/group-alias-remove.html',
    groupAliasRemoveTemplate,
  );
  $templateCache.put(
    'exchange/group/alias/group-alias.html',
    groupAliasTemplate,
  );
  $templateCache.put(
    'exchange/group/alias/add/group-alias-add.html',
    groupAliasAddTemplate,
  );
  $templateCache.put(
    'exchange/group/remove/group-remove.html',
    groupRemoveTemplate,
  );
  $templateCache.put(
    'exchange/group/update/group-update.html',
    groupUpdateTemplate,
  );
  $templateCache.put('exchange/group/group.html', groupTemplate);
  $templateCache.put(
    'exchange/group/member/remove/group-member-remove.html',
    groupMemberRemoveTemplate,
  );
  $templateCache.put(
    'exchange/group/member/group-member.html',
    groupMemberTemplate,
  );
  $templateCache.put(
    'exchange/group/delegation/group-delegation.html',
    groupDelegationTemplate,
  );
  $templateCache.put(
    'exchange/group/manager/remove/group-manager-remove.html',
    groupManagerRemoveTemplate,
  );
  $templateCache.put(
    'exchange/group/manager/group-manager.html',
    groupManagerTemplate,
  );
  $templateCache.put('exchange/group/add/group-add.html', groupAddTemplate);
  $templateCache.put(
    'exchange/group/accounts/group-accounts.html',
    groupAccountsTemplate,
  );
  $templateCache.put('exchange/diagnostic/diagnostic.html', diagnosticTemplate);
  $templateCache.put(
    'exchange/diagnostic/error/diagnostic-error-connective-owa.html',
    diagnosticErrorConnectiveOwaTemplate,
  );
  $templateCache.put(
    'exchange/diagnostic/error/diagnostic-error-is-locked.html',
    diagnosticErrorIsLockedTemplate,
  );
  $templateCache.put(
    'exchange/diagnostic/error/diagnostic-error-is-spammer.html',
    diagnosticErrorIsSpammerTemplate,
  );
  $templateCache.put(
    'exchange/diagnostic/error/diagnostic-error-is-srv-valid.html',
    diagnosticErrorIsSrvValidTemplate,
  );
  $templateCache.put(
    'exchange/diagnostic/error/diagnostic-error-can-receive-email.html',
    diagnosticErrorCanReceiveEmailTemplate,
  );
  $templateCache.put(
    'exchange/diagnostic/error/diagnostic-error-is-suspended.html',
    diagnosticErrorIsSuspendedTemplate,
  );
  $templateCache.put(
    'exchange/diagnostic/error/diagnostic-error-is-mx-valid.html',
    diagnosticErrorIsMxValidTemplate,
  );
  $templateCache.put(
    'exchange/diagnostic/error/diagnostic-error-can-send-email.html',
    diagnosticErrorCanSendEmailTemplate,
  );
  $templateCache.put(
    'exchange/shared-account/shared-account.html',
    sharedAccountTemplate,
  );
  $templateCache.put(
    'exchange/shared-account/update/shared-account-update.html',
    sharedAccountUpdateTemplate,
  );
  $templateCache.put(
    'exchange/shared-account/delete/shared-account-delete.html',
    sharedAccountDeleteTemplate,
  );
  $templateCache.put(
    'exchange/shared-account/delegation/shared-account-delegation.html',
    sharedAccountDelegationTemplate,
  );
  $templateCache.put(
    'exchange/shared-account/add/shared-account-add.html',
    sharedAccountAddTemplate,
  );
  $templateCache.put(
    'exchange/shared/remove/shared-remove.html',
    sharedRemoveTemplate,
  );
  $templateCache.put(
    'exchange/shared/update/shared-update.html',
    sharedUpdateTemplate,
  );
  $templateCache.put('exchange/shared/shared.html', sharedTemplate);
  $templateCache.put(
    'exchange/shared/popover/shared-popover.html',
    sharedPopoverTemplate,
  );
  $templateCache.put('exchange/shared/add/shared-add.html', sharedAddTemplate);
  $templateCache.put(
    'exchange/shared/permission/remove/shared-permission-remove.html',
    sharedPermissionRemoveTemplate,
  );
  $templateCache.put(
    'exchange/shared/permission/update/shared-permission-update.html',
    sharedPermissionUpdateTemplate,
  );
  $templateCache.put(
    'exchange/shared/permission/shared-permission.html',
    sharedPermissionTemplate,
  );
  $templateCache.put(
    'exchange/wizard-hosted-creation/wizard-hosted-creation.html',
    wizardHostedCreationTemplate,
  );
  $templateCache.put(
    'exchange/wizard-hosted-creation/first-step/first-step.html',
    firstStepTemplate,
  );
  $templateCache.put(
    'exchange/wizard-hosted-creation/first-step/email-creation/update/update.html',
    updateTemplate,
  );
  $templateCache.put(
    'exchange/wizard-hosted-creation/first-step/email-creation/delete/delete.html',
    deleteTemplate,
  );
  $templateCache.put(
    'exchange/wizard-hosted-creation/first-step/email-creation/add/add.html',
    addTemplate,
  );
  $templateCache.put(
    'exchange/wizard-hosted-creation/first-step/email-creation/email-creation.html',
    emailCreationTemplate,
  );
  $templateCache.put(
    'exchange/wizard-hosted-creation/first-step/domain-configuration/domain-configuration.html',
    domainConfigurationTemplate,
  );
  $templateCache.put(
    'exchange/wizard-hosted-creation/first-step/header/header.html',
    firstStepHeaderTemplate,
  );
  $templateCache.put(
    'exchange/wizard-hosted-creation/summary/automatic/automatic.html',
    automaticTemplate,
  );
  $templateCache.put(
    'exchange/wizard-hosted-creation/summary/manual/manual.html',
    manualTemplate,
  );
  $templateCache.put(
    'exchange/wizard-hosted-creation/summary/summary.html',
    summaryTemplate,
  );
  $templateCache.put(
    'exchange/external-contact/remove/external-contact-remove.html',
    externalContactRemoveTemplate,
  );
  $templateCache.put(
    'exchange/external-contact/external-contact.html',
    externalContactTemplate,
  );
  $templateCache.put(
    'exchange/external-contact/update/external-contact-update.html',
    externalContactUpdateTemplate,
  );
  $templateCache.put(
    'exchange/external-contact/add/external-contact-add.html',
    externalContactAddTemplate,
  );
  $templateCache.put('exchange/task/task.html', taskTemplate);
  $templateCache.put(
    'exchange/office-attach/dialog/office-attach-dialog.html',
    officeAttachDialogTemplate,
  );
  $templateCache.put(
    'exchange/office-attach/office-attach.html',
    officeAttachTemplate,
  );
  $templateCache.put(
    'exchange/account/order/account-order.html',
    accountOrderTemplate,
  );
  $templateCache.put(
    'exchange/account/home/account-home.html',
    accountHomeTemplate,
  );
  $templateCache.put(
    'exchange/account/alias/remove/account-alias-remove.html',
    accountAliasRemoveTemplate,
  );
  $templateCache.put(
    'exchange/account/alias/account-alias.html',
    accountAliasTemplate,
  );
  $templateCache.put(
    'exchange/account/alias/add/account-alias-add.html',
    accountAliasAddTemplate,
  );
  $templateCache.put(
    'exchange/account/remove/account-remove.html',
    accountRemoveTemplate,
  );
  $templateCache.put(
    'exchange/account/update/account-update.html',
    accountUpdateTemplate,
  );
  $templateCache.put('exchange/account/account.html', accountTemplate);
  $templateCache.put(
    'exchange/account/delegation/account-delegation.html',
    accountDelegationTemplate,
  );
  $templateCache.put(
    'exchange/account/export-as-csv/account-export-as-csv.html',
    accountExportAsCsvTemplate,
  );
  $templateCache.put(
    'exchange/account/add/account-add.html',
    accountAddTemplate,
  );
  $templateCache.put(
    'exchange/account/upgrade-300g/account-upgrade-300g.html',
    accountUpgrade300gTemplate,
  );
  $templateCache.put(
    'exchange/account/export-as-pst/account-export-as-pst.html',
    accountExportAsPstTemplate,
  );
  $templateCache.put(
    'exchange/account/outlook/delete/account-outlook-delete.html',
    accountOutlookDeleteTemplate,
  );
  $templateCache.put(
    'exchange/account/outlook/account-outlook.html',
    accountOutlookTemplate,
  );
  $templateCache.put(
    'exchange/account/outlook/add/account-outlook-add.html',
    accountOutlookAddTemplate,
  );
  $templateCache.put(
    'exchange/account/outlook/deactivate/account-outlook-deactivate.html',
    accountOutlookDeactivateTemplate,
  );
  $templateCache.put(
    'exchange/account/outlook/activate/account-outlook-activate.html',
    accountOutlookActivateTemplate,
  );
  $templateCache.put(
    'exchange/account/mfa/account-mfa.html',
    accountMfaTemplate,
  );
  $templateCache.put(
    'exchange/account/mfa/bulk-create.html',
    accountMfaBulkCreateTemplate,
  );
  $templateCache.put(
    'exchange/account/mfa/bulk-delete.html',
    accountMfaBulkDeleteTemplate,
  );
  $templateCache.put(
    'exchange/error-messages.popover.html',
    errorMessagesPopoverTemplate,
  );
  $templateCache.put(
    'exchange/resource/remove/resource-remove.html',
    resourceRemoveTemplate,
  );
  $templateCache.put(
    'exchange/resource/update/resource-update.html',
    resourceUpdateTemplate,
  );
  $templateCache.put('exchange/resource/resource.html', resourceTemplate);
  $templateCache.put(
    'exchange/resource/delegation/resource-delegation.html',
    resourceDelegationTemplate,
  );
  $templateCache.put(
    'exchange/resource/add/resource-add.html',
    resourceAddTemplate,
  );
  $templateCache.put(
    'exchange/domain/mx-autoconfig/domain-mx-autoconfig.html',
    domainMxAutoconfigTemplate,
  );
  $templateCache.put(
    'exchange/domain/remove/domain-remove.html',
    domainRemoveTemplate,
  );
  $templateCache.put(
    'exchange/domain/update/domain-update.html',
    domainUpdateTemplate,
  );
  $templateCache.put(
    'exchange/domain/srv-autoconfig/domain-srv-autoconfig.html',
    domainSrvAutoconfigTemplate,
  );
  $templateCache.put('exchange/domain/add/domain-add.html', domainAddTemplate);
  $templateCache.put('exchange/domain/domain.html', domainTemplate);
  $templateCache.put(
    'exchange/header/remove/exchange-remove.html',
    exchangeRemoveTemplate,
  );
  $templateCache.put(
    'exchange/header/license/service-license-history.html',
    serviceLicenseHistoryTemplate,
  );
  $templateCache.put('exchange/header/header.html', headerTemplate);
  $templateCache.put(
    'exchange/billing/account-renew/billing-account-renew.template.html',
    billingAccountRenewTemplate,
  );
  $templateCache.put('exchange/exchange.html', exchangeTemplate);
  $templateCache.put('exchange/security/security.html', securityTemplate);
};
