import {
  chain, find, get, map,
} from 'lodash';

export default class ManagerNavbarService {
  constructor(
    $q,
    $translate,
    asyncLoader,
    // FeatureAvailabilityService,
    LANGUAGES,
    MANAGER_URLS,
    NavbarNotificationService,
    OtrsPopupService,
    REDIRECT_URLS,
    SessionService,
    ssoAuthentication,
    TARGET,
    TranslateService,
    URLS,
  ) {
    'ngInject';

    this.$q = $q;
    this.$translate = $translate;
    // this.featureAvailabilityService = FeatureAvailabilityService;
    this.asyncLoader = asyncLoader;
    this.LANGUAGES = LANGUAGES;
    this.MANAGER_URLS = MANAGER_URLS;
    this.navbarNotificationService = NavbarNotificationService;
    this.otrsPopupService = OtrsPopupService;
    this.REDIRECT_URLS = REDIRECT_URLS;

    this.sessionService = SessionService;
    this.ssoAuthentication = ssoAuthentication;
    this.TARGET = TARGET;
    this.translateService = TranslateService;
    this.URLS = URLS;
  }

  getAssistanceMenu(locale) {
    const assistanceMenu = [];

    // Guides (External)
    const cloudGuide = get(this.URLS.guides, `cloud.${locale}`);
    const homeGuide = get(this.URLS.guides, `home.${locale}`);
    const frenchHomeGuide = get(this.URLS.guides, 'home.FR');
    if (cloudGuide) {
      assistanceMenu.push({
        title: this.$translate.instant('navbar_support_guide'),
        url: cloudGuide,
        isExternal: true,
      });
    } else if (homeGuide) {
      assistanceMenu.push({
        title: this.$translate.instant('navbar_support_all_guides'),
        url: homeGuide,
        isExternal: true,
      });
    } else if (frenchHomeGuide) {
      assistanceMenu.push({
        title: this.$translate.instant('navbar_support_all_guides'),
        url: frenchHomeGuide,
        isExternal: true,
      });
    }

    // New ticket
    assistanceMenu.push({
      title: this.$translate.instant('navbar_support_new_ticket'),
      click: (callback) => {
        if (!this.otrsPopupService.isLoaded()) {
          this.otrsPopupService.init();
        } else {
          this.otrsPopupService.toggle();
        }

        if (typeof callback === 'function') {
          callback();
        }
      },
    });

    // Tickets list
    assistanceMenu.push({
      title: this.$translate.instant('navbar_support_list_ticket'),
      url: get(this.REDIRECT_URLS, 'support', ''),
    });

    // Telephony (External)
    if (this.TARGET !== 'US') {
      assistanceMenu.push({
        title: this.$translate.instant('navbar_support_telephony_contact'),
        url: this.URLS.support_contact[locale] || this.URLS.support_contact.FR,
        isExternal: true,
      });
    }

    return {
      name: 'assistance',
      title: this.$translate.instant('navbar_support_assistance'),
      iconClass: 'icon-assistance',
      subLinks: assistanceMenu,
    };
  }

  getLanguageMenu() {
    const currentLanguage = find(this.LANGUAGES.available, {
      key: this.translateService.getUserLocale(),
    });

    return {
      name: 'languages',
      label: get(currentLanguage, 'name'),
      class: 'oui-navbar-menu_language',
      title: get(currentLanguage, 'key').split('_')[0].toUpperCase(),
      headerTitle: this.$translate.instant('navbar_language'),
      subLinks: map(this.LANGUAGES.available, lang => ({
        title: lang.name,
        isActive: lang.key === currentLanguage.key,
        click: () => {
          this.translateService.setUserLocale(lang.key);
          window.location.reload();
        },
        lang: chain(lang.key).words().head().value(),
      })),
    };
  }

  getUserMenu(currentUser) {
    return {
      name: 'user',
      title: currentUser.firstname,
      iconClass: 'icon-user',
      nichandle: currentUser.nichandle,
      fullName: `${currentUser.firstname} ${currentUser.name}`,
      subLinks: [
        // My Account
        {
          name: 'user.account',
          title: this.$translate.instant('navbar_account'),
          url: this.REDIRECT_URLS.userInfos,
          subLinks: [{
            title: this.$translate.instant('navbar_account_infos'),
            url: this.REDIRECT_URLS.userInfos,
          }, {
            title: this.$translate.instant('navbar_account_security'),
            url: this.REDIRECT_URLS.userSecurity,
          },
          (this.TARGET === 'EU' || this.TARGET === 'CA') && {
            title: this.$translate.instant('navbar_account_emails'),
            url: this.REDIRECT_URLS.userEmails,
          },
          (this.TARGET === 'EU') && {
            title: this.$translate.instant('navbar_account_subscriptions'),
            url: this.REDIRECT_URLS.userSubscriptions,
          }, {
            title: this.$translate.instant('navbar_account_ssh'),
            url: this.REDIRECT_URLS.userSSH,
          }, {
            title: this.$translate.instant('navbar_account_advanced'),
            url: this.REDIRECT_URLS.userAdvanced,
          }],
        },

        // Billing
        !currentUser.isEnterprise && {
          name: 'user.billing',
          title: this.$translate.instant('navbar_billing'),
          url: this.REDIRECT_URLS.billing,
          subLinks: [{
            title: this.$translate.instant('navbar_billing_history'),
            url: this.REDIRECT_URLS.billing,
          }, {
            title: this.$translate.instant('navbar_billing_payments'),
            url: this.REDIRECT_URLS.billingPayments,
          }],
        },

        // Services
        (this.TARGET === 'EU' || this.TARGET === 'CA') && (!currentUser.isEnterprise ? {
          name: 'user.services',
          title: this.$translate.instant('navbar_renew'),
          url: this.REDIRECT_URLS.services,
          subLinks: [{
            title: this.$translate.instant('navbar_renew_management'),
            url: this.REDIRECT_URLS.services,
          }, {
            title: this.$translate.instant('navbar_renew_agreements'),
            url: this.REDIRECT_URLS.servicesAgreements,
          }],
        } : {
          title: this.$translate.instant('navbar_renew_agreements'),
          url: this.REDIRECT_URLS.servicesAgreements,
        }),

        // Payment
        !currentUser.isEnterprise && {
          name: 'user.payment',
          title: this.$translate.instant('navbar_means'),
          url: this.REDIRECT_URLS.paymentMeans,
          subLinks: [{
            title: this.$translate.instant('navbar_means_mean'),
            url: this.REDIRECT_URLS.paymentMeans,
          },
          (this.TARGET === 'EU' || this.TARGET === 'CA') && {
            title: this.$translate.instant('navbar_means_ovhaccount'),
            url: this.REDIRECT_URLS.ovhAccount,
          },
          (this.TARGET === 'EU' || this.TARGET === 'CA') && {
            title: this.$translate.instant('navbar_means_vouchers'),
            url: this.REDIRECT_URLS.billingVouchers,
          }, {
            title: this.$translate.instant('navbar_means_refunds'),
            url: this.REDIRECT_URLS.billingRefunds,
          },
          (this.TARGET === 'EU') && {
            title: this.$translate.instant('navbar_means_fidelity'),
            url: this.REDIRECT_URLS.billingFidelity,
          }, {
            title: this.$translate.instant('navbar_means_credits'),
            url: this.REDIRECT_URLS.billingCredits,
          }],
        },

        // Orders
        (!currentUser.isEnterprise && this.TARGET === 'EU' && currentUser.ovhSubsidiary === 'FR') && {
          title: this.$translate.instant('navbar_orders'),
          url: this.REDIRECT_URLS.orders,
        },

        // Contacts
        (this.TARGET === 'EU') && {
          title: this.$translate.instant('navbar_contacts'),
          url: this.REDIRECT_URLS.contacts,
        },

        // Tickets
        {
          title: this.$translate.instant('navbar_list_ticket'),
          url: this.REDIRECT_URLS.support,
        },

        // Logout
        {
          title: this.$translate.instant('global_logout'),
          class: 'logout',
          click: (callback) => {
            this.ssoAuthentication.logout();

            if (typeof callback === 'function') {
              callback();
            }
          },
        },
      ],
    };
  }

  getInternalLinks(currentUser, notificationsMenu) {
    // Return login link if user not logged
    if (!currentUser) {
      return [{
        title: this.$translate.instant('common_login'),
        click: () => this.ssoAuthentication.logout(),
      }];
    }

    const menu = [
      this.getLanguageMenu(), // Language
      this.getAssistanceMenu(currentUser.ovhSubsidiary), // Assistance
      this.getUserMenu(currentUser), // User
    ];

    if (notificationsMenu.show) {
      menu.splice(1, 0, notificationsMenu);
    }
    return menu;
  }

  getManagersNames() {
    switch (this.TARGET) {
      case 'EU': {
        if (this.locale === 'FR') {
          return ['portal', 'gamma', 'partners'];
        }
        return ['portal', 'gamma'];
      }
      case 'CA': {
        return ['gamma'];
      }
      case 'US':
      default: {
        return [];
      }
    }
  }

  loadTranslations() {
    return this.asyncLoader.addTranslations(
      import(`./translations/Messages_${this.$translate.use()}.xml`)
        .then(module => module.default),
    );
  }

  // Get managers links for main-links attribute
  getManagerLinks() {
    const managerUrls = this.MANAGER_URLS;
    const managerNames = this.getManagersNames();

    return map(managerNames, (managerName) => {
      const managerLink = {
        name: managerName,
        class: managerName,
        title: this.$translate.instant(`navbar_${managerName}`),
        url: managerUrls[managerName],
        isPrimary: ['partners', 'labs'].indexOf(managerName) === -1,
      };

      return managerLink;
    });
  }

  // Get navbar navigation and user infos
  getNavbar() {
    const managerUrls = this.MANAGER_URLS;

    // Get base structure for the navbar
    const getBaseNavbar = (user, notifications) => {
      this.locale = user.ovhSubsidiary;

      return {
        // Set OVH Logo
        brand: {
          label: this.$translate.instant('navbar_brand_title'),
          url: managerUrls.default,
          iconAlt: 'OVH',
          iconClass: 'oui-icon oui-icon-ovh',
        },

        // Set Internal Links
        internalLinks: this.getInternalLinks(user, notifications),

        // Set Manager Links
        managerLinks: this.getManagerLinks(),
      };
    };
    return this.$q.all({
      translate: this.loadTranslations(),
      user: this.sessionService.getUser(),
      notifications: this.navbarNotificationService.getNavbarContent(),
    })
      .then(({ user, notifications }) => getBaseNavbar(user, notifications));
    // .catch(() => getBaseNavbar());
  }
}
