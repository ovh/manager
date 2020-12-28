import get from 'lodash/get';

import { FeatureAvailability } from '@ovh-ux/ng-ovh-telecom-universe-components';
import { FREEFAX_AVAILABILITY } from '@ovh-ux/manager-freefax';
import { OTB_AVAILABILITY } from '@ovh-ux/manager-overthebox';
import { ALIAS_AVAILABILITY } from '../../app/telecom/orders/alias/orders-alias.constants';
import { PACK_AVAILABILITY } from '../../app/telecom/pack/dashboard/pack.constant';

import { URLS, TELEPHONY_AVAILABILITY } from './sidebar.constants';

angular.module('managerApp').run(($translate, asyncLoader) => {
  asyncLoader.addTranslations(
    import(`./translations/Messages_${$translate.use()}.json`)
      .catch(() =>
        import(`./translations/Messages_${$translate.fallbackLanguage()}.json`),
      )
      .then((x) => x.default),
  );
  $translate.refresh();
});
angular
  .module('managerApp')
  .config((SidebarMenuProvider) => {
    // add translation path
    SidebarMenuProvider.addTranslationPath('../components/sidebar');
  })
  .run(
    /* @ngInject */ (
      $sce,
      $translate,
      $q,
      atInternet,
      betaPreferenceService,
      FaxSidebar,
      OverTheBoxSidebar,
      OvhApiMe,
      PackSidebar,
      SidebarMenu,
      SmsSidebar,
      TelecomMediator,
      TelephonySidebar,
      ORDER_URLS,
      REDIRECT_URLS,
      ovhFeatureFlipping,
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

      function initSidebarMenuItems(count, featuresAvailabilities, beta) {
        // add v4 button
        addV4Section();

        // add sidebar pack item
        if (count.pack > 0 || beta) {
          PackSidebar.init(beta);
        }

        // add sidebar telephony item
        if (get(count, 'telephony', beta)) {
          TelephonySidebar.init(beta);
        }

        // add sidebar SMS item
        if (
          featuresAvailabilities.isFeatureAvailable('sms') &&
          get(count, 'sms', beta)
        ) {
          SmsSidebar.init(beta);
        }

        // add sidebar fax item
        if (get(count, 'freefax', beta)) {
          FaxSidebar.init(beta);
        }

        // add sidenar otb item
        if (get(count, 'overTheBox', beta)) {
          OverTheBoxSidebar.init(beta);
        }

        // add sidebar task item
        addTaskSection();
      }

      /* -----  End of SIDEBAR MENU ITEMS  ------*/

      /*= ===========================================
    =            ACTIONS MENU OPTIONS            =
    ============================================ */

      function initSidebarMenuActionsOptions(user, featuresAvailabilities) {
        const aliasAvailability = new FeatureAvailability(
          user,
          ALIAS_AVAILABILITY,
        );
        const freefaxAvailability = new FeatureAvailability(
          user,
          FREEFAX_AVAILABILITY,
        );
        const otbAvailability = new FeatureAvailability(user, OTB_AVAILABILITY);
        const packAvailability = new FeatureAvailability(
          user,
          PACK_AVAILABILITY,
        );

        const telephonyAvailability = new FeatureAvailability(
          user,
          TELEPHONY_AVAILABILITY,
        );
        SidebarMenu.addActionsMenuOptions([
          ...(aliasAvailability.isAvailable('order')
            ? [
                {
                  title: $translate.instant(
                    'telecom_sidebar_actions_menu_number',
                  ),
                  icon: 'ovh-font ovh-font-hashtag',
                  state: 'telecom.orders.alias',
                },
              ]
            : []),
          {
            title: $translate.instant('telecom_sidebar_actions_menu_domain'),
            icon: 'ovh-font ovh-font-domain',
            href: URLS.domain[user.ovhSubsidiary] || URLS.domain.FR,
            target: '_blank',
            external: true,
            onClick: setTracker(
              'orders::domain-name::order',
              'action',
              'Telecom',
              'telecom',
            ),
          },
          ...(packAvailability.isAvailable('order') ||
          otbAvailability.isAvailable('order')
            ? [
                {
                  title: $translate.instant(
                    'telecom_sidebar_actions_menu_internet',
                  ),
                  icon: 'ovh-font ovh-font-telecom-ethernet',
                  subActions: [
                    ...(packAvailability.isAvailable('order')
                      ? [
                          {
                            title: $translate.instant(
                              'telecom_sidebar_actions_menu_internet_xdsl',
                            ),
                            href: URLS.internet.xdsl.FR,
                            target: '_blank',
                            external: true,
                            onClick: setTracker(
                              'orders::xdsl::order',
                              'action',
                              'Telecom',
                              'telecom',
                            ),
                          },
                          {
                            title: $translate.instant(
                              'telecom_sidebar_actions_menu_internet_fiber',
                            ),
                            href: URLS.internet.fiber.FR,
                            target: '_blank',
                            external: true,
                            onClick: setTracker(
                              'orders::fibre::order',
                              'action',
                              'Telecom',
                              'telecom',
                            ),
                          },
                          {
                            title: $translate.instant(
                              'telecom_sidebar_actions_menu_internet_sdsl',
                            ),
                            href: URLS.internet.sdsl.FR,
                            target: '_blank',
                            external: true,
                            onClick: setTracker(
                              'orders::sdsl::order',
                              'action',
                              'Telecom',
                              'telecom',
                            ),
                          },
                          {
                            title: $translate.instant(
                              'telecom_sidebar_actions_menu_internet_adsl_creation',
                            ),
                            href: URLS.internet.adslCreation.FR,
                            target: '_blank',
                            external: true,
                            onClick: setTracker(
                              'orders::adsl-new::order',
                              'action',
                              'Telecom',
                              'telecom',
                            ),
                          },
                        ]
                      : []),
                    ...(otbAvailability.isAvailable('order')
                      ? [
                          {
                            title: $translate.instant(
                              'telecom_sidebar_actions_menu_internet_otb',
                            ),
                            href: URLS.overTheBox.FR,
                            target: '_blank',
                            extrnal: true,
                          },
                        ]
                      : []),
                  ],
                },
              ]
            : []),
          ...(telephonyAvailability.isAvailable('order')
            ? [
                {
                  title: $translate.instant(
                    'telecom_sidebar_actions_menu_telephony',
                  ),
                  icon: 'ovh-font ovh-font-phone',
                  subActions: [
                    {
                      title: $translate.instant(
                        'telecom_sidebar_actions_menu_telephony_voip',
                      ),
                      href: URLS.telephony.voip.FR,
                      target: '_blank',
                      external: true,
                      onClick: setTracker(
                        'orders::telephony::voip::order',
                        'action',
                        'Telecom',
                        'telecom',
                      ),
                    },
                    {
                      title: $translate.instant(
                        'telecom_sidebar_actions_menu_telephony_siptrunk',
                      ),
                      href: URLS.telephony.siptrunk.FR,
                      target: '_blank',
                      external: true,
                      onClick: setTracker(
                        'orders::telephony::sip-trunk::order',
                        'action',
                        'Telecom',
                        'telecom',
                      ),
                    },
                    {
                      title: $translate.instant(
                        'telecom_sidebar_actions_menu_telephony_siptrunk_call',
                      ),
                      href: URLS.telephony.siptrunkCall.FR,
                      target: '_blank',
                      external: true,
                      onClick: setTracker(
                        'orders::telephony::sip-trunk-included::order',
                        'action',
                        'Telecom',
                        'telecom',
                      ),
                    },
                    {
                      title: $translate.instant(
                        'telecom_sidebar_actions_menu_accessories',
                      ),
                      state: 'telecom.orders.accessories',
                    },
                  ],
                },
              ]
            : []),
          {
            title: $translate.instant('telecom_sidebar_actions_menu_email'),
            icon: 'ovh-font ovh-font-mail',
            subActions: [
              {
                title: $translate.instant(
                  'telecom_sidebar_actions_menu_email_exchange',
                ),
                href:
                  URLS.email.exchange[user.ovhSubsidiary] ||
                  ORDER_URLS.email.exchange.FR,
                target: '_blank',
                external: true,
                onClick: setTracker(
                  'orders::email::email-microsoft-exchange::order',
                  'action',
                  'Telecom',
                  'telecom',
                ),
              },
              {
                title: $translate.instant(
                  'telecom_sidebar_actions_menu_email_sharepoint',
                ),
                href:
                  URLS.email.sharepoint[user.ovhSubsidiary] ||
                  ORDER_URLS.email.sharepoint.FR,
                target: '_blank',
                external: true,
                onClick: setTracker(
                  'orders::email::microsoft-sharepoint::order',
                  'action',
                  'Telecom',
                  'telecom',
                ),
              },
            ],
          },
          {
            title: $translate.instant('telecom_sidebar_actions_menu_office'),
            svg: $sce.trustAsHtml(
              '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 53.59 64.356" width="32" height="32">' +
                '<g transform="translate(-216.07358,-549.28882)">' +
                '<g transform="matrix(1.8232952,0,0,1.8232952,-597.71681,-124.12247)">' +
                '<g transform="translate(0,-91.137241)">' +
                '<g fill="currentColor" transform="matrix(0.74069815,0,0,0.74069815,98.5698,-8.2505871)">' +
                '<path d="m469.87,671.03,0-28.52,25.229-9.3238,13.711,4.3877,0,38.392-13.711,4.133-25.229-9.0691,25.229,3.0361,0-33.201-16.454,3.8392,0,22.487z"/>' +
                '</g></g></g></g></svg>',
            ),
            subActions: [
              {
                title: $translate.instant(
                  'telecom_sidebar_actions_menu_office_business',
                ),
                href:
                  URLS.office.business[user.ovhSubsidiary] ||
                  ORDER_URLS.office.business.FR,
                target: '_blank',
                external: true,
                onClick: setTracker(
                  'orders::office365::licences-office::order',
                  'action',
                  'Telecom',
                  'telecom',
                ),
              },
              {
                title: $translate.instant(
                  'telecom_sidebar_actions_menu_office_sharepoint',
                ),
                href:
                  URLS.office.sharepoint[user.ovhSubsidiary] ||
                  ORDER_URLS.office.sharepoint.FR,
                target: '_blank',
                external: true,
                onClick: setTracker(
                  'orders::office365::microsoft-sharepoint::order',
                  'action',
                  'Telecom',
                  'telecom',
                ),
              },
            ],
          },
          ...(featuresAvailabilities.isFeatureAvailable('sms:order')
            ? [
                {
                  title: $translate.instant('telecom_sidebar_actions_menu_sms'),
                  icon: 'ovh-font ovh-font-message',
                  ...(featuresAvailabilities.isFeatureAvailable('sms:hlr')
                    ? {
                        subActions: [
                          {
                            title: $translate.instant(
                              'telecom_sidebar_actions_menu_sms',
                            ),
                            state: 'sms.order',
                          },
                          {
                            title: $translate.instant(
                              'telecom_sidebar_actions_menu_sms_hlr',
                            ),
                            href: URLS.sms.hlr.FR,
                            target: '_blank',
                            external: true,
                            onClick: setTracker(
                              'orders::sms::hlr::order',
                              'action',
                              'Telecom',
                              'telecom',
                            ),
                          },
                        ],
                      }
                    : {
                        state: 'sms.order',
                      }),
                },
              ]
            : []),
          ...(freefaxAvailability.isAvailable('order')
            ? [
                {
                  title: $translate.instant('telecom_sidebar_actions_menu_fax'),
                  icon: 'ovh-font ovh-font-print',
                  href: URLS.fax.FR,
                  target: '_blank',
                  external: true,
                  onClick: setTracker(
                    'orders::freefax::order',
                    'action',
                    'Telecom',
                    'telecom',
                  ),
                },
              ]
            : []),
        ]);
      }

      /* -----  End of ACTIONS MENU OPTIONS  ------*/

      /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

      function init() {
        let featuresAvailabilities;

        // set initialization promise
        return SidebarMenu.setInitializationPromise(
          $q
            .all({
              beta: betaPreferenceService.isBetaActive(),
              features: ovhFeatureFlipping.checkFeatureAvailability([
                'sms',
                'sms:order',
                'sms:hlr',
              ]),
            })
            .then((results) => $translate.refresh().then(() => results))
            .then(({ beta, features }) => {
              featuresAvailabilities = features;
              if (beta) {
                return initSidebarMenuItems({}, featuresAvailabilities, beta);
              }
              return TelecomMediator.initServiceCount(false).then((count) => {
                initSidebarMenuItems(count, featuresAvailabilities, beta);
              });
            })
            .then(() => OvhApiMe.v6().get().$promise)
            .then((user) =>
              initSidebarMenuActionsOptions(user, featuresAvailabilities),
            ),
        );
      }

      /* -----  End of INITIALIZATION  ------*/

      init();
    },
  );
