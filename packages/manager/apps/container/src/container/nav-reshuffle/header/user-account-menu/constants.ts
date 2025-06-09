import { UserLink } from './UserLink';

export const tracking = {
  open: 'topnav_v3::user_widget::open',
  goToProfile: 'topnav_v3::user_widget::go_to_profile',
  connexionMethode: 'topnav_v3::user_widget::connexion_method',
  supportLevel: 'topnav_v3::user_widget::support_level',
  paymentMethod: 'topnav_v3::user_widget::payment_method',
  myAccount: 'topnav_v3::user_widget::my_account',
  myServices: 'topnav_v3::user_widget::my_services',
  billingBills: 'topnav_v3::user_widget::billing_bills',
  accountContacts: 'topnav_v3::user_widget::account_contacts',
  orders: 'topnav_v3::user_widget::orders',
  contacts: 'topnav_v3::user_widget::contacts',
  contracts: 'topnav_v3::user_widget::contracts',
  logout: 'topnav_v3::user_widget::logout',
};

export const links: UserLink[] = [
  {
    app: 'new-account',
    key: 'user-account-menu-profile',
    hash: '#/useraccount/dashboard',
    i18nKey: 'user_account_menu_profile',
    trackingHit: tracking.goToProfile,
    regions: ['EU', 'CA', 'US'],
  },
  {
    app: 'new-billing',
    key: 'myInvoices',
    hash: '#/history',
    i18nKey: 'user_account_menu_my_invoices',
    trackingHit: tracking.billingBills,
    regions: ['EU', 'CA', 'US'],
  },
  {
    app: 'new-billing',
    key: 'myServices',
    hash: '#/autorenew',
    i18nKey: 'user_account_menu_my_services',
    trackingHit: tracking.myServices,
    regions: ['EU', 'CA', 'US']
  },
  {
    app: 'new-billing',
    key: 'myContracts',
    hash: '#/autorenew/agreements',
    i18nKey: 'user_account_menu_my_contracts',
    trackingHit: tracking.contracts,
    regions: ['EU', 'CA'],
  },
  {
    app: 'new-account',
    key: 'myCommunications',
    hash: '#/useraccount/emails',
    i18nKey: 'user_account_menu_my_communication',
    trackingHit: tracking.accountContacts,
    regions: ['EU', 'CA'],
  },
  {
    app: 'new-billing',
    key: 'myPaymentMethods',
    hash: '#/payment/method',
    i18nKey: 'user_account_menu_my_payment_methods',
    trackingHit: tracking.paymentMethod,
    regions: ['EU', 'CA', 'US'],
  },
  {
    app: 'new-billing',
    key: 'myCommands',
    hash: '#/orders',
    i18nKey: 'user_account_menu_my_commands',
    trackingHit: tracking.orders,
    regions: ['EU', 'CA', 'US'],
  },
  {
    app: 'new-account',
    key: 'myContacts',
    hash: '#/contacts/services',
    i18nKey: 'user_account_menu_my_contacts',
    trackingHit: tracking.contacts,
    regions: ['EU', 'CA'],
  },
  {
    app: 'dedicated',
    key: 'myAssistanceTickets',
    hash: '#/ticket',
    i18nKey: 'user_account_menu_my_assistance_tickets',
    regions: ['US'],
  }
];
