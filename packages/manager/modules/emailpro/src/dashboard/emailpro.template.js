import emailproRemoveTemplate from '../remove/emailpro-remove.html';
import emailproInformationTemplate from '../information/emailpro-information.html';
import emailproDisclaimerRemoveTemplate from '../disclaimer/remove/emailpro-disclaimer-remove.html';
import emailproDisclaimerUpdateTemplate from '../disclaimer/update/emailpro-disclaimer-update.html';
import emailproDisclaimerTemplate from '../disclaimer/emailpro-disclaimer.html';
import emailproDisclaimerAddTemplate from '../disclaimer/add/emailpro-disclaimer-add.html';
import emailproUpdateRenewTemplate from '../update/renew/emailpro-update-renew.html';
import emailDomainEmailRedirectionUpdateTemplate from '../redirection/update/email-domain-email-redirection-update.html';
import emailDomainEmailRedirectionDeleteTemplate from '../redirection/delete/email-domain-email-redirection-delete.html';
import emailproRedirectionTemplate from '../redirection/emailpro-redirection.html';
import emailDomainEmailRedirectionCreateTemplate from '../redirection/create/email-domain-email-redirection-create.html';
import emailproExternalContactRemoveTemplate from '../external-contact/remove/emailpro-external-contact-remove.html';
import emailproExternalContactUpdateTemplate from '../external-contact/update/emailpro-external-contact-update.html';
import emailproExternalContactAddTemplate from '../external-contact/add/emailpro-external-contact-add.html';
import emailproExternalContactTemplate from '../external-contact/emailpro-external-contact.html';
import emailproTemplate from './emailpro.html';
import emailproTaskTemplate from '../task/emailpro-task.html';
import emailproErrorMessagesPopoverTemplate from './emailpro-error-messages.popover.html';
import emailproAccountOrderTemplate from '../account/order/emailpro-account-order.html';
import emailproAccountAliasRemoveTemplate from '../account/alias/remove/emailpro-account-alias-remove.html';
import emailproAccountAliasTemplate from '../account/alias/emailpro-account-alias.html';
import emailproAccountAliasAddTemplate from '../account/alias/add/emailpro-account-alias-add.html';
import emailproAccountRemoveTemplate from '../account/remove/emailpro-account-remove.html';
import emailproAccountUpdateTemplate from '../account/update/emailpro-account-update.html';
import emailproAccountDelegationTemplate from '../account/delegation/emailpro-account-delegation.html';
import emailproAccountAddTemplate from '../account/add/emailpro-account-add.html';
import emailproAccountTemplate from '../account/emailpro-account.html';
import emailproServiceConfigureTemplate from '../service/configure/emailpro-service-configure.html';
import emailproDomainMxAutoconfigTemplate from '../domain/mx-autoconfig/emailpro-domain-mx-autoconfig.html';
import emailproDomainDkimAutoconfigTemplate from '../domain/dkim-autoconfig/emailpro-domain-dkim-autoconfig.html';
import emailproDomainTemplate from '../domain/emailpro-domain.html';
import emailproDomainRemoveTemplate from '../domain/remove/emailpro-domain-remove.html';
import emailproDomainUpdateTemplate from '../domain/update/emailpro-domain-update.html';
import emailproDomainSrvAutoconfigTemplate from '../domain/srv-autoconfig/emailpro-domain-srv-autoconfig.html';
import emailproDomainSpfAutoconfigTemplate from '../domain/spf-autoconfig/emailpro-domain-spf-autoconfig.html';
import emailproDomainAddTemplate from '../domain/add/emailpro-domain-add.html';
import emailproMailingListUpdateTemplate from '../mailing-list/update/emailpro-mailing-list-update.html';
import emailproMailingListDeleteTemplate from '../mailing-list/delete/emailpro-mailing-list-delete.html';
import emailproMailingListSendListByEmailTemplate from '../mailing-list/send-list-by-email/emailpro-mailing-list-send-list-by-email.html';
import emailproMailingListModeratorDeleteTemplate from '../mailing-list/moderator/delete/emailpro-mailing-list-moderator-delete.html';
import emailproMailingListViewTemplate from '../mailing-list/emailpro-mailing-list-view.html';
import emailproMailingListModeratorsDeleteTemplate from '../mailing-list/moderators/delete/emailpro-mailing-list-moderators-delete.html';
import emailproMailingListModeratorsViewTemplate from '../mailing-list/moderators/emailpro-mailing-list-moderators-view.html';
import emailproMailingListModeratorsCreateTemplate from '../mailing-list/moderators/create/emailpro-mailing-list-moderators-create.html';
import emailproMailingListSubscribersDeleteTemplate from '../mailing-list/subscribers/delete/emailpro-mailing-list-subscribers-delete.html';
import emailproMailingListSubscribersViewTemplate from '../mailing-list/subscribers/emailpro-mailing-list-subscribers-view.html';
import emailproMailingListSubscribersCreateTemplate from '../mailing-list/subscribers/create/emailpro-mailing-list-subscribers-create.html';
import emailproMailingListSubscriberDeleteTemplate from '../mailing-list/subscriber/delete/emailpro-mailing-list-subscriber-delete.html';
import emailproMailingListCreateTemplate from '../mailing-list/create/emailpro-mailing-list-create.html';

export default /* @ngInject */ ($templateCache) => {
  $templateCache.put(
    'emailpro/remove/emailpro-remove.html',
    emailproRemoveTemplate,
  );
  $templateCache.put(
    'emailpro/information/emailpro-information.html',
    emailproInformationTemplate,
  );
  $templateCache.put(
    'emailpro/disclaimer/remove/emailpro-disclaimer-remove.html',
    emailproDisclaimerRemoveTemplate,
  );
  $templateCache.put(
    'emailpro/disclaimer/update/emailpro-disclaimer-update.html',
    emailproDisclaimerUpdateTemplate,
  );
  $templateCache.put(
    'emailpro/disclaimer/emailpro-disclaimer.html',
    emailproDisclaimerTemplate,
  );
  $templateCache.put(
    'emailpro/disclaimer/add/emailpro-disclaimer-add.html',
    emailproDisclaimerAddTemplate,
  );
  $templateCache.put(
    'emailpro/update/renew/emailpro-update-renew.html',
    emailproUpdateRenewTemplate,
  );
  $templateCache.put(
    'emailpro/redirection/update/email-domain-email-redirection-update.html',
    emailDomainEmailRedirectionUpdateTemplate,
  );
  $templateCache.put(
    'emailpro/redirection/delete/email-domain-email-redirection-delete.html',
    emailDomainEmailRedirectionDeleteTemplate,
  );
  $templateCache.put(
    'emailpro/redirection/emailpro-redirection.html',
    emailproRedirectionTemplate,
  );
  $templateCache.put(
    'emailpro/redirection/create/email-domain-email-redirection-create.html',
    emailDomainEmailRedirectionCreateTemplate,
  );
  $templateCache.put(
    'emailpro/external-contact/remove/emailpro-external-contact-remove.html',
    emailproExternalContactRemoveTemplate,
  );
  $templateCache.put(
    'emailpro/external-contact/update/emailpro-external-contact-update.html',
    emailproExternalContactUpdateTemplate,
  );
  $templateCache.put(
    'emailpro/external-contact/add/emailpro-external-contact-add.html',
    emailproExternalContactAddTemplate,
  );
  $templateCache.put(
    'emailpro/external-contact/emailpro-external-contact.html',
    emailproExternalContactTemplate,
  );
  $templateCache.put('emailpro/emailpro.html', emailproTemplate);
  $templateCache.put('emailpro/task/emailpro-task.html', emailproTaskTemplate);
  $templateCache.put(
    'emailpro/emailpro-error-messages.popover.html',
    emailproErrorMessagesPopoverTemplate,
  );
  $templateCache.put(
    'emailpro/account/order/emailpro-account-order.html',
    emailproAccountOrderTemplate,
  );
  $templateCache.put(
    'emailpro/account/alias/remove/emailpro-account-alias-remove.html',
    emailproAccountAliasRemoveTemplate,
  );
  $templateCache.put(
    'emailpro/account/alias/emailpro-account-alias.html',
    emailproAccountAliasTemplate,
  );
  $templateCache.put(
    'emailpro/account/alias/add/emailpro-account-alias-add.html',
    emailproAccountAliasAddTemplate,
  );
  $templateCache.put(
    'emailpro/account/remove/emailpro-account-remove.html',
    emailproAccountRemoveTemplate,
  );
  $templateCache.put(
    'emailpro/account/update/emailpro-account-update.html',
    emailproAccountUpdateTemplate,
  );
  $templateCache.put(
    'emailpro/account/delegation/emailpro-account-delegation.html',
    emailproAccountDelegationTemplate,
  );
  $templateCache.put(
    'emailpro/account/add/emailpro-account-add.html',
    emailproAccountAddTemplate,
  );
  $templateCache.put(
    'emailpro/account/emailpro-account.html',
    emailproAccountTemplate,
  );
  $templateCache.put(
    'emailpro/service/configure/emailpro-service-configure.html',
    emailproServiceConfigureTemplate,
  );
  $templateCache.put(
    'emailpro/domain/mx-autoconfig/emailpro-domain-mx-autoconfig.html',
    emailproDomainMxAutoconfigTemplate,
  );
  $templateCache.put(
    'emailpro/domain/dkim-autoconfig/emailpro-domain-dkim-autoconfig.html',
    emailproDomainDkimAutoconfigTemplate,
  );
  $templateCache.put(
    'emailpro/domain/emailpro-domain.html',
    emailproDomainTemplate,
  );
  $templateCache.put(
    'emailpro/domain/remove/emailpro-domain-remove.html',
    emailproDomainRemoveTemplate,
  );
  $templateCache.put(
    'emailpro/domain/update/emailpro-domain-update.html',
    emailproDomainUpdateTemplate,
  );
  $templateCache.put(
    'emailpro/domain/srv-autoconfig/emailpro-domain-srv-autoconfig.html',
    emailproDomainSrvAutoconfigTemplate,
  );
  $templateCache.put(
    'emailpro/domain/spf-autoconfig/emailpro-domain-spf-autoconfig.html',
    emailproDomainSpfAutoconfigTemplate,
  );
  $templateCache.put(
    'emailpro/domain/add/emailpro-domain-add.html',
    emailproDomainAddTemplate,
  );
  $templateCache.put(
    'emailpro/mailing-list/update/emailpro-mailing-list-update.html',
    emailproMailingListUpdateTemplate,
  );
  $templateCache.put(
    'emailpro/mailing-list/delete/emailpro-mailing-list-delete.html',
    emailproMailingListDeleteTemplate,
  );
  $templateCache.put(
    'emailpro/mailing-list/send-list-by-email/emailpro-mailing-list-send-list-by-email.html',
    emailproMailingListSendListByEmailTemplate,
  );
  $templateCache.put(
    'emailpro/mailing-list/moderator/delete/emailpro-mailing-list-moderator-delete.html',
    emailproMailingListModeratorDeleteTemplate,
  );
  $templateCache.put(
    'emailpro/mailing-list/emailpro-mailing-list-view.html',
    emailproMailingListViewTemplate,
  );
  $templateCache.put(
    'emailpro/mailing-list/moderators/delete/emailpro-mailing-list-moderators-delete.html',
    emailproMailingListModeratorsDeleteTemplate,
  );
  $templateCache.put(
    'emailpro/mailing-list/moderators/emailpro-mailing-list-moderators-view.html',
    emailproMailingListModeratorsViewTemplate,
  );
  $templateCache.put(
    'emailpro/mailing-list/moderators/create/emailpro-mailing-list-moderators-create.html',
    emailproMailingListModeratorsCreateTemplate,
  );
  $templateCache.put(
    'emailpro/mailing-list/subscribers/delete/emailpro-mailing-list-subscribers-delete.html',
    emailproMailingListSubscribersDeleteTemplate,
  );
  $templateCache.put(
    'emailpro/mailing-list/subscribers/emailpro-mailing-list-subscribers-view.html',
    emailproMailingListSubscribersViewTemplate,
  );
  $templateCache.put(
    'emailpro/mailing-list/subscribers/create/emailpro-mailing-list-subscribers-create.html',
    emailproMailingListSubscribersCreateTemplate,
  );
  $templateCache.put(
    'emailpro/mailing-list/subscriber/delete/emailpro-mailing-list-subscriber-delete.html',
    emailproMailingListSubscriberDeleteTemplate,
  );
  $templateCache.put(
    'emailpro/mailing-list/create/emailpro-mailing-list-create.html',
    emailproMailingListCreateTemplate,
  );
};
