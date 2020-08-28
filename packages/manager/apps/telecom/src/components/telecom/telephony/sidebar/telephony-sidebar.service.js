import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';

angular
  .module('managerApp')
  .service('TelephonySidebar', function TelephonySidebar(
    $q,
    $translate,
    SidebarMenu,
    tucTelecomVoip,
    tucVoipService,
    TUC_TELEPHONY_VOIP_SERVICE_FEATURE_TYPES,
  ) {
    const self = this;
    self.mainSectionItem = null;

    function addServiceMenuItems(services, options, billingAccountSubSection) {
      services.forEach((service) => {
        SidebarMenu.addMenuItem(
          {
            id: service.serviceName,
            title: service.getDisplayedName(),
            state: options.state,
            stateParams: {
              billingAccount: service.billingAccount,
              serviceName: service.serviceName,
            },
            prefix:
              options.prefix && angular.isFunction(options.prefix)
                ? options.prefix(service)
                : options.prefix,
          },
          billingAccountSubSection,
        );
      });
    }

    /*
     * Telephony sidebar initilization
     */
    self.initTelephonySubsection = function initTelephonySubsection() {
      return tucTelecomVoip.fetchAll().then((billingAccounts) => {
        // first sort by getDisplayedName
        const sortedBillingAccounts = billingAccounts.sort((first, second) =>
          first.getDisplayedName().localeCompare(second.getDisplayedName()),
        );

        sortedBillingAccounts.forEach((billingAccount) => {
          // create subsection object
          const billingAccountSubSection = SidebarMenu.addMenuItem(
            {
              id: billingAccount.billingAccount,
              title: billingAccount.getDisplayedName(),
              state: 'telecom.telephony.billingAccount',
              stateParams: {
                billingAccount: billingAccount.billingAccount,
              },
              allowSubItems: billingAccount.services.length > 0,
            },
            self.mainSectionItem,
          );

          /* ----------  Numbers (alias) display  ---------- */

          // first sort numbers of the billingAccount
          const sortedAlias = tucVoipService.constructor.sortServicesByDisplayedName(
            billingAccount.getAlias(),
          );

          // add number subsections to billingAccount subsection
          addServiceMenuItems(
            sortedAlias,
            {
              state: 'telecom.telephony.billingAccount.alias.details',
              prefix: $translate.instant(
                'telecom_sidebar_section_telephony_number',
              ),
            },
            billingAccountSubSection,
          );

          /* ----------  Lines display  ---------- */

          // first sort lines of the billingAccount
          const sortedLines = tucVoipService.constructor.sortServicesByDisplayedName(
            billingAccount.getLines(),
          );

          const groupedLines = tucVoipService.constructor.groupByFeatureType(
            sortedLines,
          );

          const sortedSipLines = get(
            groupedLines,
            TUC_TELEPHONY_VOIP_SERVICE_FEATURE_TYPES.DEFAULT_GROUP,
          );

          // add line subsections to billingAccount subsection
          const sipTrunkPrefix = $translate.instant(
            'telecom_sidebar_section_telephony_trunk',
          );
          const sipPrefix = $translate.instant(
            'telecom_sidebar_section_telephony_line',
          );

          if (!isEmpty(sortedSipLines)) {
            addServiceMenuItems(
              sortedSipLines,
              {
                state: 'telecom.telephony.billingAccount.line',
                prefix(lineService) {
                  return lineService.isSipTrunk() ? sipTrunkPrefix : sipPrefix;
                },
              },
              billingAccountSubSection,
            );
          }

          // second get plugAndFax
          const sortedPlugAndFaxLines = get(
            groupedLines,
            TUC_TELEPHONY_VOIP_SERVICE_FEATURE_TYPES.GROUPS.plugAndFax,
          );

          // add plugAndFax subsections to billingAccount subsection
          if (!isEmpty(sortedPlugAndFaxLines)) {
            addServiceMenuItems(
              sortedPlugAndFaxLines,
              {
                state: 'telecom.telephony.billingAccount.line',
                prefix: $translate.instant(
                  'telecom_sidebar_section_telephony_plug_fax',
                ),
              },
              billingAccountSubSection,
            );
          }

          // then get fax
          const sortedFaxLines = get(
            groupedLines,
            TUC_TELEPHONY_VOIP_SERVICE_FEATURE_TYPES.GROUPS.fax,
          );

          // add fax subsections to billingAccount subsection
          if (!isEmpty(sortedFaxLines)) {
            addServiceMenuItems(
              sortedFaxLines,
              {
                state: 'telecom.telephony.billingAccount.fax',
                prefix: $translate.instant(
                  'telecom_sidebar_section_telephony_fax',
                ),
              },
              billingAccountSubSection,
            );
          }

          const sortedCarrierSipLines = get(
            groupedLines,
            TUC_TELEPHONY_VOIP_SERVICE_FEATURE_TYPES.GROUPS.carrierSip,
          );

          if (!isEmpty(sortedCarrierSipLines)) {
            addServiceMenuItems(
              sortedCarrierSipLines,
              {
                state: 'telecom.telephony.billingAccount.carrierSip.dashboard',
                prefix: $translate.instant(
                  'telecom_sidebar_section_telephony_carrier_sip',
                ),
              },
              billingAccountSubSection,
            );
          }
        });
      });
    };

    self.init = function init(expand) {
      self.mainSectionItem = SidebarMenu.addMenuItem({
        title: $translate.instant('telecom_sidebar_section_telephony'),
        error: $translate.instant('telecom_sidebar_load_error'),
        id: 'telecom-telephony-section',
        category: 'telephony',
        icon: 'ovh-font ovh-font-phone',
        allowSubItems: !expand,
        loadOnState: 'telecom.telephony',
        allowSearch: !expand,
        infiniteScroll: true,
        ...(expand
          ? { state: 'telecom.telephony.index' }
          : { onLoad: self.initTelephonySubsection }),
      });

      return self.mainSectionItem;
    };
  });
