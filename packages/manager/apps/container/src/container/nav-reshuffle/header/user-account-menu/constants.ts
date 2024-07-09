import { UserLink } from "./UserLink";

export const links: UserLink[] = [
  {
    key: 'user-account-menu-profile',
    hash: '#/useraccount/dashboard',
    i18nKey: 'user_account_menu_profile',
    trackingHit: 'topnav::user_widget::go_to_profile',
  },
  {
    key: 'myInvoices',
    hash: '#/billing/history',
    i18nKey: 'user_account_menu_my_invoices',
  },
  {
    key: 'myServices',
    hash: '#/billing/autorenew',
    i18nKey: 'user_account_menu_my_services',
  },
  {
    key: 'myCommunications',
    hash: '#/useraccount/emails',
    i18nKey: 'user_account_menu_my_communication',
  },
  {
    key: 'myPaymentMethods',
    hash: '#/billing/payment/method',
    i18nKey: 'user_account_menu_my_payment_methods',
  },
  {
    key: 'myCommands',
    hash: '#/billing/orders',
    i18nKey: 'user_account_menu_my_commands',
  },
  {
    key: 'myContacts',
    hash: '#/contacts/services',
    i18nKey: 'user_account_menu_my_contacts'
  }
];
