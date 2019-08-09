angular
  .module('App')
  .run(
    /* @ngInject */
    (
      $q,
      $rootScope,
      $translate,
      coreConfig,
      SidebarMenu,
      User,
    ) => {
      function buildMyAccountMenu() {
        const myAccountMenu = SidebarMenu.addMenuItem({
          name: 'userAccountMenu',
          title: $translate.instant('menu_account_title'),
          allowSubItems: true,
          allowSearch: true,
          loadOnState: 'app.account.useraccount',
          namespace: 'account',
        });

        SidebarMenu.addMenuItem({
          title: $translate.instant('menu_infos'),
          state: 'app.account.useraccount.infos',
        }, myAccountMenu);

        SidebarMenu.addMenuItem({
          title: $translate.instant('menu_security'),
          state: 'app.account.useraccount.security',
        }, myAccountMenu);

        if (coreConfig.getRegion() === 'EU' || coreConfig.getRegion() === 'CA') {
          SidebarMenu.addMenuItem({
            title: $translate.instant('menu_emails'),
            state: 'app.account.useraccount.emails',
          }, myAccountMenu);
        }

        SidebarMenu.addMenuItem({
          title: $translate.instant('menu_ssh'),
          state: 'app.account.useraccount.ssh',
        }, myAccountMenu);

        if (coreConfig.getRegion() === 'EU' || coreConfig.getRegion() === 'CA') {
          SidebarMenu.addMenuItem({
            title: $translate.instant('menu_advanced'),
            state: 'app.account.useraccount.advanced',
          }, myAccountMenu);
        }

        SidebarMenu.addMenuItem({
          title: $translate.instant('menu_users_management'),
          state: 'app.account.useraccount.users',
        }, myAccountMenu);
      }

      function buildBillingMenu() {
        if (coreConfig.getRegion() === 'US') {
          SidebarMenu.addMenuItem({
            name: 'billingMenu',
            title: $translate.instant('menu_billing'),
            state: 'app.account.billing.main.pay-as-you-go',
            loadOnState: 'app.account.billing.main',
            namespace: 'account',
          });
        } else {
          SidebarMenu.addMenuItem({
            name: 'billingMenu',
            title: $translate.instant('menu_billing'),
            state: 'app.account.billing.main.history',
            namespace: 'account',
          });
        }
      }

      function buildServicesMenu(curUser) {
        if (coreConfig.getRegion() === 'EU' || coreConfig.getRegion() === 'CA') {
          if (!curUser.isEnterprise) {
            const servicesMenu = SidebarMenu.addMenuItem({
              name: 'servicesMenu',
              title: $translate.instant('menu_services'),
              allowSubItems: true,
              allowSearch: true,
              loadOnState: 'app.account.billing.service',
              namespace: 'account',
            });

            SidebarMenu.addMenuItem({
              title: $translate.instant('menu_services_management'),
              state: 'app.account.billing.service.autoRenew',
            }, servicesMenu);

            SidebarMenu.addMenuItem({
              title: $translate.instant('menu_agreements'),
              state: 'app.account.billing.service.agreements',
            }, servicesMenu);
          } else {
            SidebarMenu.addMenuItem({
              name: 'servicesMenuAgreements',
              title: $translate.instant('menu_agreements'),
              state: 'app.account.billing.service.agreements',
              namespace: 'account',
            });
          }
        }
      }

      function buildPaymentMenu() {
        return SidebarMenu.addMenuItem({
          name: 'paymentMenu',
          title: $translate.instant('menu_payment_methods'),
          state: 'app.account.billing.payment',
          namespace: 'account',
        });
      }

      function init() {
        $rootScope.$on('global_display_name_change', (evt, { displayName, serviceName }) => {
          SidebarMenu.updateItemDisplay(
            {
              title: displayName,
            },
            {
              stateParams: {
                productId: serviceName,
              },
            },
          );
        });

        return $q.all({
          translate: $translate.refresh(),
          user: User.getUser(),
        }).then((result) => {
          SidebarMenu.addMenuItem({
            name: 'billingBack',
            title: $translate.instant('menu_back'),
            state: 'app.configuration',
            namespace: 'account',
          });

          buildMyAccountMenu();

          // remove billing menu for accounts flagged as enterprise
          if (!result.user.isEnterprise) {
            buildBillingMenu();
          }
          buildServicesMenu(result.user);

          // remove payment menu and orders menu for accounts flagged as enterprise
          if (!result.user.isEnterprise) {
            buildPaymentMenu();

            SidebarMenu.addMenuItem({
              name: 'billingOrders',
              title: $translate.instant('menu_orders'),
              state: 'app.account.billing.orders',
              namespace: 'account',
            });
          }

          if (coreConfig.getRegion() === 'EU') {
            SidebarMenu.addMenuItem({
              name: 'billingContacts',
              title: $translate.instant('menu_contacts'),
              state: 'app.account.useraccount.contacts.services',
              namespace: 'account',
            });
          }

          SidebarMenu.addMenuItem({
            name: 'accountTickets',
            title: $translate.instant('menu_tickets'),
            state: 'app.account.otrs-ticket',
            namespace: 'account',
          });
        });
      }

      init();
    },
  );
