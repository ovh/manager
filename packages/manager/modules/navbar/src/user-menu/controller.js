import { Environment } from '@ovh-ux/manager-config';
import { MAX_NAME_LENGTH, URLS } from './constants';

export default class {
  /* @ngInject */
  constructor($q, $translate, atInternet, ovhManagerNavbarMenuHeaderBuilder) {
    this.$q = $q;
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.NavbarBuilder = ovhManagerNavbarMenuHeaderBuilder;

    this.REGION = Environment.getRegion();
  }

  $onInit() {
    this.isLoading = true;

    return this.$translate.refresh()
      .then(() => this.getMenuTitle())
      .then((menuTitle) => {
        this.menuTitle = menuTitle;
        this.sublinks = this.getSublinks();
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  getMenuTitle() {
    const username = this.user.firstname.length > MAX_NAME_LENGTH ? `${this.user.firstname.substring(0, MAX_NAME_LENGTH)}…` : this.user.firstname;
    return this.NavbarBuilder.buildMenuHeader(`
      ${this.$translate.instant('navbar_user_support_userAccount_1', { username })}
      <br>
      ${this.$translate.instant('navbar_user_support_userAccount_2')}
    `);
  }

  trackUserMenuSection(name, chapter2) {
    this.atInternet.trackClick({
      name,
      type: 'action',
      chapter1: 'account',
      chapter2,
    });
  }

  getSublinks() {
    return [{
      name: 'user.account',
      title: this.$translate.instant('navbar_user_account'),
      url: URLS.userInfos,
      click: () => this.trackUserMenuSection('my_account', 'account'),
      subLinks: [{
        title: this.$translate.instant('navbar_user_account_infos'),
        url: URLS.userInfos,
      }, {
        title: this.$translate.instant('navbar_user_account_security'),
        url: URLS.userSecurity,
      }, (this.REGION === 'EU' || this.REGION === 'CA') && {
        title: this.$translate.instant('navbar_user_account_emails'),
        url: URLS.userEmails,
      }, (this.REGION === 'EU') && {
        title: this.$translate.instant('navbar_user_account_subscriptions'),
        url: URLS.userSubscriptions,
      }, {
        title: this.$translate.instant('navbar_user_account_ssh'),
        url: URLS.userSSH,
      }, {
        title: this.$translate.instant('navbar_user_account_advanced'),
        url: URLS.userAdvanced,
      }],
    },

    // Billing
    !this.user.isEnterprise && {
      name: 'user.billing',
      title: this.$translate.instant('navbar_user_billing'),
      url: URLS.billing,
      click: () => this.trackUserMenuSection('my_facturation', 'billing'),
      subLinks: [{
        title: this.$translate.instant('navbar_user_billing_history'),
        url: URLS.billing,
      }, {
        title: this.$translate.instant('navbar_user_billing_payments'),
        url: URLS.billingPayments,
      }],
    },

    // Services
    (this.REGION === 'EU' || this.REGION === 'CA') && (!this.user.isEnterprise ? {
      name: 'user.services',
      title: this.$translate.instant('navbar_user_renew'),
      url: URLS.services,
      click: () => this.trackUserMenuSection('my_services', 'services'),
      subLinks: [{
        title: this.$translate.instant('navbar_user_renew_management'),
        url: URLS.services,
      }, {
        title: this.$translate.instant('navbar_user_renew_agreements'),
        url: URLS.servicesAgreements,
      }],
    } : {
      title: this.$translate.instant('navbar_user_renew_agreements'),
      url: URLS.servicesAgreements,
    }),

    // Payment
    !this.user.isEnterprise && {
      name: 'user.payment',
      title: this.$translate.instant('navbar_user_means'),
      url: URLS.paymentMeans,
      click: () => this.trackUserMenuSection('my_payment_types', 'payment_types'),
      subLinks: [{
        title: this.$translate.instant('navbar_user_means_mean'),
        url: URLS.paymentMeans,
      }, (this.REGION === 'EU' || this.REGION === 'CA') && {
        title: this.$translate.instant('navbar_user_means_ovhaccount'),
        url: URLS.ovhAccount,
      }, (this.REGION === 'EU' || this.REGION === 'CA') && {
        title: this.$translate.instant('navbar_user_means_vouchers'),
        url: URLS.billingVouchers,
      }, {
        title: this.$translate.instant('navbar_user_means_refunds'),
        url: URLS.billingRefunds,
      }, (this.REGION === 'EU') && {
        title: this.$translate.instant('navbar_user_means_fidelity'),
        url: URLS.billingFidelity,
      }, {
        title: this.$translate.instant('navbar_user_means_credits'),
        url: URLS.billingCredits,
      }],
    },

    // Orders
    (!this.user.isEnterprise && this.REGION === 'EU' && this.user.ovhSubsidiary === 'FR') && {
      title: this.$translate.instant('navbar_user_orders_all'),
      url: URLS.orders,
      click: () => this.trackUserMenuSection('my_orders', 'orders'),
    },

    // Contacts
    (this.REGION === 'EU') && {
      title: this.$translate.instant('navbar_user_contacts'),
      url: URLS.contacts,
      click: () => this.trackUserMenuSection('my_contacts', 'contacts'),
    },

    // Logout
    {
      title: this.$translate.instant('navbar_user_logout'),
      class: 'logout',
      click: (callback) => {
        this.ssoAuthentication.logout();

        if (typeof callback === 'function') {
          callback();
        }
      },
    }];
  }
}
