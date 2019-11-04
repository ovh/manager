angular.module('managerApp').run(($translate, asyncLoader) => {
  asyncLoader.addTranslations(
    import(`./translations/Messages_${$translate.use()}.json`)
      .catch(() => import(`./translations/Messages_${$translate.fallbackLanguage()}.json`))
      .then(x => x.default),
  );
  $translate.refresh();
});
angular.module('managerApp').config((SidebarMenuProvider) => {
  // add translation path
  SidebarMenuProvider.addTranslationPath('../components/sidebar');
}).run((
  $sce, $translate,
  atInternet, FaxSidebar, OverTheBoxSidebar, PackSidebar,
  SidebarMenu, SmsSidebar, SpareSidebar, TelecomMediator, TelephonySidebar,
  ORDER_URLS, REDIRECT_URLS,
) => {
  /*= =========================================
    =                   HELPERS                 =
    ========================================== */

  function setTracker(name, navigation, level2, chapter1) {
    return () => {
      atInternet.trackClick({
        name,
        type: navigation,
        level2,
        chapter1,
      });

      return true;
    };
  }

  /*= =========================================
    =            SIDEBAR MENU ITEMS            =
    ========================================== */

  /* ----------  TASK MENU ITEM  ----------*/

  function addTaskSection() {
    return SidebarMenu.addMenuItem({
      title: $translate.instant('telecom_sidebar_section_task'),
      category: 'task',
      icon: 'ovh-font ovh-font-tasks',
      state: 'task',
      loadOnState: 'task',
    });
  }

  function addV4Section() {
    return SidebarMenu.addMenuItem({
      title: $translate.instant('telecom_sidebar_section_v4'),
      category: 'backToV4',
      icon: 'ovh-font ovh-font-backToV4',
      url: REDIRECT_URLS.telephonyV4,
      onClick: setTracker('ManagerV4', 'navigation', 'Telecom', 'telecom'),
    });
  }

  /* ----------  SERVICES MENU ITEMS  ----------*/

  function initSidebarMenuItems(count) {
    // add v4 button
    addV4Section();

    // add sidebar pack item
    if (count.pack > 0) {
      PackSidebar.init();
    }

    // add sidebar telephony item
    if (count.telephony > 0) {
      TelephonySidebar.init();
    }

    // add sidebar SMS item
    if (count.sms > 0) {
      SmsSidebar.init();
    }

    // add sidebar fax item
    if (count.freefax > 0) {
      FaxSidebar.init();
    }

    // add sidebar otb item
    if (count.overTheBox > 0) {
      OverTheBoxSidebar.init();
    }

    // add sidebar spare item
    SpareSidebar.init();

    // add sidebar task item
    addTaskSection();
  }

  /* -----  End of SIDEBAR MENU ITEMS  ------*/

  /*= ===========================================
    =            ACTIONS MENU OPTIONS            =
    ============================================ */

  function initSidebarMenuActionsOptions() {
    SidebarMenu.addActionsMenuOptions([{
      title: $translate.instant('telecom_sidebar_actions_menu_number'),
      icon: 'ovh-font ovh-font-hashtag',
      state: 'telecom.orders.alias',
    }, {
      title: $translate.instant('telecom_sidebar_actions_menu_domain'),
      icon: 'ovh-font ovh-font-domain',
      href: ORDER_URLS.domain,
      target: '_blank',
      external: true,
      onClick: setTracker('DomainsName', 'navigation', 'Telecom', 'telecom'),
    }, {
      title: $translate.instant('telecom_sidebar_actions_menu_internet'),
      icon: 'ovh-font ovh-font-telecom-ethernet',
      subActions: [{
        title: $translate.instant('telecom_sidebar_actions_menu_internet_xdsl'),
        href: ORDER_URLS.internet.xdsl,
        target: '_blank',
        external: true,
        onClick: setTracker('order-ADSL_VDSL', 'navigation', 'Telecom', 'telecom'),
      }, {
        title: $translate.instant('telecom_sidebar_actions_menu_internet_fiber'),
        href: ORDER_URLS.internet.fiber,
        target: '_blank',
        external: true,
        onClick: setTracker('order-FIBER', 'navigation', 'Telecom', 'telecom'),
      }, {
        title: $translate.instant('telecom_sidebar_actions_menu_internet_sdsl'),
        href: ORDER_URLS.internet.sdsl,
        target: '_blank',
        external: true,
        onClick: setTracker('order-SDSL', 'navigation', 'Telecom', 'telecom'),
      }, {
        title: $translate.instant('telecom_sidebar_actions_menu_internet_adsl_creation'),
        href: ORDER_URLS.internet.adslCreation,
        target: '_blank',
        external: true,
        onClick: setTracker('order-ADSL', 'navigation', 'Telecom', 'telecom'),
      }, {
        title: $translate.instant('telecom_sidebar_actions_menu_internet_otb'),
        href: ORDER_URLS.overTheBox,
      }],
    }, {
      title: $translate.instant('telecom_sidebar_actions_menu_telephony'),
      icon: 'ovh-font ovh-font-phone',
      subActions: [{
        title: $translate.instant('telecom_sidebar_actions_menu_telephony_voip'),
        href: ORDER_URLS.telephony.voip,
        target: '_blank',
        external: true,
        onClick: setTracker('order-VOIP', 'navigation', 'Telecom', 'telecom'),
      }, {
        title: $translate.instant('telecom_sidebar_actions_menu_telephony_siptrunk'),
        href: ORDER_URLS.telephony.siptrunk,
        target: '_blank',
        external: true,
        onClick: setTracker('order-Pack_SIP_Trunk', 'navigation', 'Telecom', 'telecom'),
      }, {
        title: $translate.instant('telecom_sidebar_actions_menu_telephony_siptrunk_call'),
        href: ORDER_URLS.telephony.siptrunkCall,
        target: '_blank',
        external: true,
        onClick: setTracker('order-SIP_Trunk_Abo', 'navigation', 'Telecom', 'telecom'),
      }, {
        title: $translate.instant('telecom_sidebar_actions_menu_accessories'),
        state: 'telecom.orders.accessories',
      }],
    }, {
      title: $translate.instant('telecom_sidebar_actions_menu_email'),
      icon: 'ovh-font ovh-font-mail',
      subActions: [{
        title: $translate.instant('telecom_sidebar_actions_menu_email_exchange'),
        href: ORDER_URLS.email.exchange,
        target: '_blank',
        external: true,
        onClick: setTracker('order-Email_ExchangeHosted', 'navigation', 'Telecom', 'telecom'),
      }, {
        title: $translate.instant('telecom_sidebar_actions_menu_email_sharepoint'),
        href: ORDER_URLS.email.sharepoint,
        target: '_blank',
        external: true,
        onClick: setTracker('order-Email_Sharepoint', 'navigation', 'Telecom', 'telecom'),
      }],
    }, {
      title: $translate.instant('telecom_sidebar_actions_menu_office'),
      svg: $sce.trustAsHtml('<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 53.59 64.356" width="32" height="32">'
                + '<g transform="translate(-216.07358,-549.28882)">'
                + '<g transform="matrix(1.8232952,0,0,1.8232952,-597.71681,-124.12247)">'
                + '<g transform="translate(0,-91.137241)">'
                + '<g fill="#143F6C" transform="matrix(0.74069815,0,0,0.74069815,98.5698,-8.2505871)">'
                + '<path d="m469.87,671.03,0-28.52,25.229-9.3238,13.711,4.3877,0,38.392-13.711,4.133-25.229-9.0691,25.229,3.0361,0-33.201-16.454,3.8392,0,22.487z"/>'
                + '</g></g></g></g></svg>'),
      subActions: [{
        title: $translate.instant('telecom_sidebar_actions_menu_office_business'),
        href: ORDER_URLS.office.business,
        target: '_blank',
        external: true,
        onClick: setTracker('order-O365_Business', 'navigation', 'Telecom', 'telecom'),
      }, {
        title: $translate.instant('telecom_sidebar_actions_menu_office_sharepoint'),
        href: ORDER_URLS.office.sharepoint,
        target: '_blank',
        external: true,
        onClick: setTracker('order-O365_Sharepoint', 'navigation', 'Telecom', 'telecom'),
      }],
    },
    {
      title: $translate.instant('telecom_sidebar_actions_menu_sms'),
      icon: 'ovh-font ovh-font-message',
      subActions: [{
        title: $translate.instant('telecom_sidebar_actions_menu_sms'),
        state: 'sms.order',
      }, {
        title: $translate.instant('telecom_sidebar_actions_menu_sms_hlr'),
        href: ORDER_URLS.sms.hlr,
        target: '_blank',
        external: true,
        onClick: setTracker('order-sms-HLR', 'navigation', 'Telecom', 'telecom'),
      }],
    }, {
      title: $translate.instant('telecom_sidebar_actions_menu_fax'),
      icon: 'ovh-font ovh-font-print',
      href: ORDER_URLS.fax,
      target: '_blank',
      external: true,
      onClick: setTracker('Fax', 'navigation', 'Telecom', 'telecom'),
    }]);
  }

  /* -----  End of ACTIONS MENU OPTIONS  ------*/

  /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

  function init() {
    // set initialization promise
    return SidebarMenu.setInitializationPromise(
      TelecomMediator.initServiceCount()
        .then(count => $translate.refresh().then(() => count))
        .then((count) => {
          initSidebarMenuItems(count);
          initSidebarMenuActionsOptions();
        }),
    );
  }

  /* -----  End of INITIALIZATION  ------*/

  init();
});
