angular
  .module('App')
  .run(/* @ngTranslationsInject:json ./translations */)
  .run(
    /* @ngInject */
    (
      $q,
      $rootScope,
      $translate,
      coreConfig,
      SidebarMenu,
      User,
      coreURLBuilder,
    ) => {
      function buildMyAccountMenu() {
        SidebarMenu.addMenuItem({
          name: 'userAccountMenu',
          title: $translate.instant('menu_account_title'),
          allowSubItems: false,
          allowSearch: false,
          loadOnState: 'app.account.user',
          state: 'app.account.user.dashboard',
          namespace: 'account',
        });
      }

      function buildBillingMenu() {
        if (coreConfig.isRegion('US')) {
          SidebarMenu.addMenuItem({
            name: 'billingMenu',
            title: $translate.instant('menu_bills'),
            state: 'app.account.billing.main.pay-as-you-go',
            loadOnState: 'app.account.billing.main',
            namespace: 'account',
          });
        } else {
          SidebarMenu.addMenuItem({
            name: 'billingMenu',
            title: $translate.instant('menu_bills'),
            state: 'app.account.billing.main.history',
            namespace: 'account',
          });
        }
      }

      function buildServicesMenu(user) {
        SidebarMenu.addMenuItem({
          name: 'servicesMenu',
          title: $translate.instant('menu_services'),
          state: user.isEnterprise
            ? 'app.account.billing.autorenew.ssh'
            : 'app.account.billing.autorenew',
          namespace: 'account',
        });
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
        $rootScope.$on(
          'global_display_name_change',
          (evt, { displayName, serviceName, stateParams }) => {
            SidebarMenu.updateItemDisplay(
              {
                title: displayName,
              },
              {
                stateParams: stateParams || {
                  productId: serviceName,
                },
              },
            );
          },
        );

        return $q
          .all({
            translate: $translate.refresh(),
            user: User.getUser(),
          })
          .then((result) => {
            SidebarMenu.addMenuItem({
              name: 'billingBack',
              title: $translate.instant('menu_back'),
              url: coreURLBuilder.buildURL('hub', ''),
              target: '_top',
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

            if (coreConfig.isRegion('EU')) {
              SidebarMenu.addMenuItem({
                name: 'billingContacts',
                title: $translate.instant('menu_contacts'),
                state: 'app.account.contacts.services',
                namespace: 'account',
              });
            }

            if (coreConfig.isRegion('US')) {
              SidebarMenu.addMenuItem({
                name: 'support',
                title: $translate.instant('menu_support'),
                state: 'app.otrs.tickets',
                namespace: 'account',
              });
            } else {
              SidebarMenu.addMenuItem({
                name: 'support',
                title: $translate.instant('menu_support'),
                state: 'support',
                namespace: 'account',
              });
            }
          });
      }

      init();
    },
  );
