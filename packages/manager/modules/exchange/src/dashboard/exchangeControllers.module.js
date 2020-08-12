import angular from 'angular';

import ExchangeCtrl from './exchange.controller';
import ExchangeTabsCtrl from './exchange.tabs.controller';
import ExchangeAddExternalContactCtrl from '../external-contact/add/external-contact-add.controller';
import ExchangeTabExternalContactsCtrl from '../external-contact/external-contact.controller';
import ExchangeExternalContactsDeleteCtrl from '../external-contact/remove/external-contact-remove.controller';
import ExchangeExternalContactsModifyCtrl from '../external-contact/update/external-contact-update.controller';
import ExchangeGroupAccountsCtrl from '../group/accounts/group-accounts.controller';
import ExchangeAddGroupCtrl from '../group/add/group-add.controller';
import ExchangeAddGroupAliasCtrl from '../group/alias/add/group-alias-add.controller';
import ExchangeTabGroupAliasCtrl from '../group/alias/group-alias.controller';
import ExchangeRemoveGroupAliasCtrl from '../group/alias/remove/group-alias-remove.controller';
import ExchangeMailingListDelegationCtrl from '../group/delegation/group-delegation.controller';
import ExchangeTabGroupsCtrl from '../group/group.controller';
import ExchangeTabManagersByGroupsCtrl from '../group/manager/group-manager.controller';
import ExchangeRemoveManagerCtrl from '../group/manager/remove/group-manager-remove.controller';
import ExchangeTabMembersByGroupsCtrl from '../group/member/group-member.controller';
import ExchangeRemoveMemberCtrl from '../group/member/remove/group-member-remove.controller';
import ExchangeRemoveGroupCtrl from '../group/remove/group-remove.controller';
import ExchangeUpdateGroupCtrl from '../group/update/group-update.controller';
import exchangeLicenseHistoryCtrl from '../header/license/service-license-history.controller';
import ExchangeRemoveExchangeCtrl from '../header/remove/exchange-remove.controller';
import ExchangeOrderDiskSpaceCtrl from '../information/disk/service-disk-order-space.controller';
import ExchangeTabInformationCtrl from '../information/information.controller';
import ExchangeMigration2016Ctrl from '../information/migration-2016/service-migration-2016.controller';
import ExchangeSslRenewCtrl from '../information/ssl/service-ssl.controller';
import officeAttachDialogCtrl from '../office-attach/dialog/office-attach-dialog.controller';
import ExchangeOrderCtrl from '../order/order.controller';
import ExchangeAddResourceController from '../resource/add/resource-add.controller';
import ExchangeResourceDelegationCtrl from '../resource/delegation/resource-delegation.controller';
import ExchangeRemoveResourceCtrl from '../resource/remove/resource-remove.controller';
import ExchangeTabResourcesCtrl from '../resource/resource.controller';
import ExchangeUpdateResourceController from '../resource/update/resource-update.controller';
import ExchangeAddSharedAccountCtrl from '../shared-account/add/shared-account-add.controller';
import ExchangeSharedAccountDelegationCtrl from '../shared-account/delegation/shared-account-delegation.controller';
import exchangeAccountCtlr from '../account/account.controller';
import ExchangeAddAccountAliasCtrl from '../account/alias/add/account-alias-add.controller';
import ExchangeRemoveAliasCtrl from '../account/alias/remove/account-alias-remove.controller';
import ExchangeAccountDelegationCtrl from '../account/delegation/account-delegation.controller';
import ExchangeExportToCsvAccountsCtrl from '../account/export-as-csv/account-export-as-csv.controller';
import ExchangeExportAsPstCtrl from '../account/export-as-pst/account-export-as-pst.controller';
import ExchangeOrderAccountCtrl from '../account/order/account-order.controller';
import ExchangeDisplayOutlookCtrl from '../account/outlook/account-outlook.controller';
import ExchangeActivateOutlookCtrl from '../account/outlook/activate/account-outlook-activate.controller';
import ExchangeAddOutlookCtrl from '../account/outlook/add/account-outlook-add.controller';
import exchangeAccountOutlookDeactivate from '../account/outlook/deactivate/account-outlook-deactivate.controller';
import exchangeAccountOutlookDelete from '../account/outlook/delete/account-outlook-delete.controller';
import ExchangeRemoveAccountCtrl from '../account/remove/account-remove.controller';
import ExchangeUpdateAccountCtrl from '../account/update/account-update.controller';
import ExchangeUpgrade300GCtrl from '../account/upgrade-300g/account-upgrade-300g.controller';
import ExchangeUpdateRenewCtrl from '../billing/account-renew/renew.controller';
import ExchangeAccountMfaCtrl from '../account/mfa/account-mfa.controller';
import ExchangeTabDiagnosticsCtrl from '../diagnostic/diagnostic.controller';
import ExchangeAddDisclaimerCtrl from '../disclaimer/add/disclaimer-add.controller';
import ExchangeDisclaimerCtrl from '../disclaimer/disclaimer.controller';
import ExchangeRemoveDisclaimerCtrl from '../disclaimer/remove/disclaimer-remove.controller';
import ExchangeUpdateDisclaimerCtrl from '../disclaimer/update/disclaimer-update.controller';
import ExchangeAddDomainController from '../domain/add/domain-add.controller';
import ExchangeTabDomainsCtrl from '../domain/domain.controller';
import ExchangeDomainMxAutoconfigCtrl from '../domain/mx-autoconfig/domain-mx-autoconfig.controller';
import ExchangeRemoveDomainCtrl from '../domain/remove/domain-remove.controller';
import ExchangeDomainSrvAutoconfigCtrl from '../domain/srv-autoconfig/domain-srv-autoconfig.controller';
import ExchangeUpdateDomainCtrl from '../domain/update/domain-update.controller';
import ExchangeDeleteSharedAccountCtrl from '../shared-account/delete/shared-account-delete.controller';
import ExchangeTabSharedAccountsCtrl from '../shared-account/shared-account.controller';
import ExchangeUpdateSharedAccountCtrl from '../shared-account/update/shared-account-update.controller';
import ExchangeAddPublicFolderCtrl from '../shared/add/shared-add.controller';
import ExchangeRemovePublicFolderPermissionCtrl from '../shared/permission/remove/shared-permission-remove.controller';
import ExchangeTabPublicFolderPermissionsCtrl from '../shared/permission/shared-permission.controller';
import ExchangeUpdatePublicFolderPermissionCtrl from '../shared/permission/update/shared-permission-update.controller';
import ExchangeToolboxSharedCtrl from '../shared/popover/shared-popover.controller';
import ExchangeRemoveSharedCtrl from '../shared/remove/share-remove.controller';
import ExchangeTabPublicFolderCtrl from '../shared/shared.controller';
import ExchangeUpdatePublicFolderCtrl from '../shared/update/shared-update.controller';
import ExchangeTabTasksCtrl from '../task/task.controller';
import exchangeWizardHostedCreationEmailCreationAddController from '../wizard-hosted-creation/first-step/email-creation/add/add.controller';
import exchangeWizardHostedCreationEmailCreationDeleteController from '../wizard-hosted-creation/first-step/email-creation/delete/delete.controller';
import exchangeWizardHostedCreationEmailCreationUpdateController from '../wizard-hosted-creation/first-step/email-creation/update/update.controller';
import exchangeWizardHostedCreationAutoController from '../wizard-hosted-creation/summary/automatic/automatic.controller';
import exchangeWizardHostedCreationManualController from '../wizard-hosted-creation/summary/manual/manual.controller';
import ExchangeServicesConfigureCtrl from '../security/security.controller';

const moduleName = 'Module.exchange.controllers';

angular
  .module(moduleName, [])
  .controller('ExchangeCtrl', ExchangeCtrl)
  .controller('ExchangeTabsCtrl', ExchangeTabsCtrl)
  // .controller('ExchangeToolboxGroupsCtrl', ExchangeToolboxGroupsCtrl)
  // .controller('ExchangeToolboxDisclaimerCtrl', ExchangeToolboxDisclaimerCtrl)
  // .controller('ExchangeToolboxSharedCtrl', ExchangeToolboxSharedCtrl)
  .controller('ExchangeAddExternalContactCtrl', ExchangeAddExternalContactCtrl)
  .controller(
    'ExchangeTabExternalContactsCtrl',
    ExchangeTabExternalContactsCtrl,
  )
  .controller(
    'ExchangeExternalContactsDeleteCtrl',
    ExchangeExternalContactsDeleteCtrl,
  )
  .controller(
    'ExchangeExternalContactsModifyCtrl',
    ExchangeExternalContactsModifyCtrl,
  )
  .controller('ExchangeGroupAccountsCtrl', ExchangeGroupAccountsCtrl)
  .controller('ExchangeAddGroupCtrl', ExchangeAddGroupCtrl)
  .controller('ExchangeAddGroupAliasCtrl', ExchangeAddGroupAliasCtrl)
  .controller('ExchangeTabGroupAliasCtrl', ExchangeTabGroupAliasCtrl)
  .controller('ExchangeRemoveGroupAliasCtrl', ExchangeRemoveGroupAliasCtrl)
  .controller(
    'ExchangeMailingListDelegationCtrl',
    ExchangeMailingListDelegationCtrl,
  )
  .controller('ExchangeTabGroupsCtrl', ExchangeTabGroupsCtrl)
  .controller(
    'ExchangeTabManagersByGroupsCtrl',
    ExchangeTabManagersByGroupsCtrl,
  )
  .controller('ExchangeRemoveManagerCtrl', ExchangeRemoveManagerCtrl)
  .controller('ExchangeTabMembersByGroupsCtrl', ExchangeTabMembersByGroupsCtrl)
  .controller('ExchangeRemoveMemberCtrl', ExchangeRemoveMemberCtrl)
  .controller('ExchangeRemoveGroupCtrl', ExchangeRemoveGroupCtrl)
  .controller('ExchangeUpdateGroupCtrl', ExchangeUpdateGroupCtrl)
  .controller('exchangeLicenseHistoryCtrl', exchangeLicenseHistoryCtrl)
  .controller('ExchangeRemoveExchangeCtrl', ExchangeRemoveExchangeCtrl)
  .controller('ExchangeOrderDiskSpaceCtrl', ExchangeOrderDiskSpaceCtrl)
  .controller('ExchangeTabInformationCtrl', ExchangeTabInformationCtrl)
  .controller('ExchangeMigration2016Ctrl', ExchangeMigration2016Ctrl)
  .controller('ExchangeSslRenewCtrl', ExchangeSslRenewCtrl)
  .controller('officeAttachDialogCtrl', officeAttachDialogCtrl)
  .controller('ExchangeOrderCtrl', ExchangeOrderCtrl)
  .controller('ExchangeAddResourceController', ExchangeAddResourceController)
  .controller('ExchangeResourceDelegationCtrl', ExchangeResourceDelegationCtrl)
  .controller('ExchangeRemoveResourceCtrl', ExchangeRemoveResourceCtrl)
  .controller('ExchangeTabResourcesCtrl', ExchangeTabResourcesCtrl)
  .controller(
    'ExchangeUpdateResourceController',
    ExchangeUpdateResourceController,
  )
  .controller('ExchangeAddSharedAccountCtrl', ExchangeAddSharedAccountCtrl)
  .controller(
    'ExchangeSharedAccountDelegationCtrl',
    ExchangeSharedAccountDelegationCtrl,
  )
  .controller('exchangeAccountCtlr', exchangeAccountCtlr)
  .controller('ExchangeAddAccountAliasCtrl', ExchangeAddAccountAliasCtrl)
  .controller('ExchangeRemoveAliasCtrl', ExchangeRemoveAliasCtrl)
  .controller('ExchangeAccountDelegationCtrl', ExchangeAccountDelegationCtrl)
  .controller(
    'ExchangeExportToCsvAccountsCtrl',
    ExchangeExportToCsvAccountsCtrl,
  )
  .controller('ExchangeExportAsPstCtrl', ExchangeExportAsPstCtrl)
  .controller('ExchangeOrderAccountCtrl', ExchangeOrderAccountCtrl)
  .controller('ExchangeDisplayOutlookCtrl', ExchangeDisplayOutlookCtrl)
  .controller('ExchangeActivateOutlookCtrl', ExchangeActivateOutlookCtrl)
  .controller('ExchangeAddOutlookCtrl', ExchangeAddOutlookCtrl)
  .controller(
    'exchangeAccountOutlookDeactivate',
    exchangeAccountOutlookDeactivate,
  )
  .controller('exchangeAccountOutlookDelete', exchangeAccountOutlookDelete)
  .controller('ExchangeRemoveAccountCtrl', ExchangeRemoveAccountCtrl)
  .controller('ExchangeUpdateAccountCtrl', ExchangeUpdateAccountCtrl)
  .controller('ExchangeUpgrade300GCtrl', ExchangeUpgrade300GCtrl)
  .controller('ExchangeUpdateRenewCtrl', ExchangeUpdateRenewCtrl)
  .controller('ExchangeAccountMfaCtrl', ExchangeAccountMfaCtrl)
  .controller('ExchangeTabDiagnosticsCtrl', ExchangeTabDiagnosticsCtrl)
  .controller('ExchangeAddDisclaimerCtrl', ExchangeAddDisclaimerCtrl)
  .controller('ExchangeDisclaimerCtrl', ExchangeDisclaimerCtrl)
  .controller('ExchangeRemoveDisclaimerCtrl', ExchangeRemoveDisclaimerCtrl)
  .controller('ExchangeUpdateDisclaimerCtrl', ExchangeUpdateDisclaimerCtrl)
  .controller('ExchangeAddDomainController', ExchangeAddDomainController)
  .controller('ExchangeTabDomainsCtrl', ExchangeTabDomainsCtrl)
  .controller('ExchangeDomainMxAutoconfigCtrl', ExchangeDomainMxAutoconfigCtrl)
  .controller('ExchangeRemoveDomainCtrl', ExchangeRemoveDomainCtrl)
  .controller(
    'ExchangeDomainSrvAutoconfigCtrl',
    ExchangeDomainSrvAutoconfigCtrl,
  )
  .controller('ExchangeUpdateDomainCtrl', ExchangeUpdateDomainCtrl)
  .controller(
    'ExchangeDeleteSharedAccountCtrl',
    ExchangeDeleteSharedAccountCtrl,
  )
  .controller('ExchangeTabSharedAccountsCtrl', ExchangeTabSharedAccountsCtrl)
  .controller(
    'ExchangeUpdateSharedAccountCtrl',
    ExchangeUpdateSharedAccountCtrl,
  )
  .controller('ExchangeAddPublicFolderCtrl', ExchangeAddPublicFolderCtrl)
  .controller(
    'ExchangeRemovePublicFolderPermissionCtrl',
    ExchangeRemovePublicFolderPermissionCtrl,
  )
  .controller(
    'ExchangeTabPublicFolderPermissionsCtrl',
    ExchangeTabPublicFolderPermissionsCtrl,
  )
  .controller(
    'ExchangeUpdatePublicFolderPermissionCtrl',
    ExchangeUpdatePublicFolderPermissionCtrl,
  )
  .controller('ExchangeToolboxSharedCtrl', ExchangeToolboxSharedCtrl)
  .controller('ExchangeRemoveSharedCtrl', ExchangeRemoveSharedCtrl)
  .controller('ExchangeTabPublicFolderCtrl', ExchangeTabPublicFolderCtrl)
  .controller('ExchangeUpdatePublicFolderCtrl', ExchangeUpdatePublicFolderCtrl)
  .controller('ExchangeTabTasksCtrl', ExchangeTabTasksCtrl)
  .controller(
    'exchangeWizardHostedCreationEmailCreationAddController',
    exchangeWizardHostedCreationEmailCreationAddController,
  )
  .controller(
    'exchangeWizardHostedCreationEmailCreationDeleteController',
    exchangeWizardHostedCreationEmailCreationDeleteController,
  )
  .controller(
    'exchangeWizardHostedCreationEmailCreationUpdateController',
    exchangeWizardHostedCreationEmailCreationUpdateController,
  )
  .controller(
    'exchangeWizardHostedCreationAutoController',
    exchangeWizardHostedCreationAutoController,
  )
  .controller(
    'exchangeWizardHostedCreationManualController',
    exchangeWizardHostedCreationManualController,
  )
  .controller('ExchangeServicesConfigureCtrl', ExchangeServicesConfigureCtrl);

export default moduleName;
