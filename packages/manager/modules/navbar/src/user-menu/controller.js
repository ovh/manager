import { MAX_NAME_LENGTH, USER_MENU_URLS } from './constants';

export default class {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    atInternet,
    coreConfig,
    ovhManagerNavbarMenuHeaderBuilder,
    ssoAuthentication,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.NavbarBuilder = ovhManagerNavbarMenuHeaderBuilder;
    this.ssoAuthentication = ssoAuthentication;

    this.REGION = coreConfig.getRegion();
    this.URLS = USER_MENU_URLS[this.REGION];
  }

  $onInit() {
    this.isLoading = true;

    return this.$translate
      .refresh()
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
    const username =
      this.user.firstname.length > MAX_NAME_LENGTH
        ? `${this.user.firstname.substring(0, MAX_NAME_LENGTH)}…`
        : this.user.firstname;
    return this.NavbarBuilder.buildMenuHeader(`
      ${this.$translate.instant('navbar_user_support_userAccount_1', {
        username,
      })}
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
    return [
      {
        name: 'user.account',
        title: this.$translate.instant('navbar_user_account'),
        url: this.URLS.userInfos,
        click: () => this.trackUserMenuSection('my_account', 'account'),
        subLinks: [
          {
            title: this.$translate.instant('navbar_user_account_infos'),
            url: this.URLS.userInfos,
          },
          {
            title: this.$translate.instant('navbar_user_account_security'),
            url: this.URLS.userSecurity,
          },
          (this.REGION === 'EU' || this.REGION === 'CA') && {
            title: this.$translate.instant('navbar_user_account_emails'),
            url: this.URLS.userEmails,
          },
          this.REGION === 'EU' && {
            title: this.$translate.instant('navbar_user_account_subscriptions'),
            url: this.URLS.userSubscriptions,
          },
          {
            title: this.$translate.instant('navbar_user_account_ssh'),
            url: this.URLS.userSSH,
          },
          {
            title: this.$translate.instant('navbar_user_account_advanced'),
            url: this.URLS.userAdvanced,
          },
        ],
      },

      // Billing
      !this.user.isEnterprise && {
        name: 'user.billing',
        title: this.$translate.instant('navbar_user_billing'),
        url: this.URLS.billing,
        click: () => this.trackUserMenuSection('my_facturation', 'billing'),
        subLinks: [
          {
            title: this.$translate.instant('navbar_user_billing_history'),
            url: this.URLS.billing,
          },
          {
            title: this.$translate.instant('navbar_user_billing_payments'),
            url: this.URLS.billingPayments,
          },
        ],
      },

      this.user.isEnterprise &&
        this.REGION === 'US' && {
          name: 'user.billing',
          title: this.$translate.instant('navbar_user_billing'),
          url: this.URLS.billingEnterprise,
        },

      // Services
      (this.REGION === 'EU' || this.REGION === 'CA') &&
        (!this.user.isEnterprise
          ? {
              name: 'user.services',
              title: this.$translate.instant('navbar_user_renew'),
              url: this.URLS.services,
              click: () => this.trackUserMenuSection('my_services', 'services'),
              subLinks: [
                {
                  title: this.$translate.instant(
                    'navbar_user_renew_management',
                  ),
                  url: this.URLS.services,
                },
                {
                  title: this.$translate.instant(
                    'navbar_user_renew_agreements',
                  ),
                  url: this.URLS.servicesAgreements,
                },
              ],
            }
          : {
              title: this.$translate.instant('navbar_user_renew_agreements'),
              url: this.URLS.servicesAgreements,
            }),

      // Payment
      !this.user.isEnterprise && {
        name: 'user.payment',
        title: this.$translate.instant('navbar_user_means'),
        url: this.URLS.paymentMeans,
        click: () =>
          this.trackUserMenuSection('my_payment_types', 'payment_types'),
        subLinks: [
          {
            title: this.$translate.instant('navbar_user_means_mean'),
            url: this.URLS.paymentMeans,
          },
          (this.REGION === 'EU' || this.REGION === 'CA') && {
            title: this.$translate.instant('navbar_user_means_ovhaccount'),
            url: this.URLS.ovhAccount,
          },
          (this.REGION === 'EU' || this.REGION === 'CA') && {
            title: this.$translate.instant('navbar_user_means_vouchers'),
            url: this.URLS.billingVouchers,
          },
          {
            title: this.$translate.instant('navbar_user_means_refunds'),
            url: this.URLS.billingRefunds,
          },
          this.REGION === 'EU' && {
            title: this.$translate.instant('navbar_user_means_fidelity'),
            url: this.URLS.billingFidelity,
          },
          {
            title: this.$translate.instant('navbar_user_means_credits'),
            url: this.URLS.billingCredits,
          },
        ],
      },

      // Orders
      !this.user.isEnterprise &&
        this.REGION === 'EU' &&
        this.user.ovhSubsidiary === 'FR' && {
          title: this.$translate.instant('navbar_user_orders_all'),
          url: this.URLS.orders,
          click: () => this.trackUserMenuSection('my_orders', 'orders'),
        },

      // Contacts
      this.REGION === 'EU' && {
        title: this.$translate.instant('navbar_user_contacts'),
        url: this.URLS.contacts,
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
      },
    ];
  }
}
