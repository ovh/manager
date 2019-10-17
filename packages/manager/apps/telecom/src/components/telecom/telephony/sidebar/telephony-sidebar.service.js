import filter from 'lodash/filter';

angular.module('managerApp').service('TelephonySidebar', function TelephonySidebar($q, $translate, SidebarMenu, tucTelecomVoip, tucVoipService) {
  const self = this;
  self.mainSectionItem = null;

  function addServiceMenuItems(services, options, billingAccountSubSection) {
    services.forEach((service) => {
      SidebarMenu.addMenuItem({
        id: service.serviceName,
        title: service.getDisplayedName(),
        state: options.state,
        stateParams: {
          billingAccount: service.billingAccount,
          serviceName: service.serviceName,
        },
        prefix: options.prefix
          && angular.isFunction(options.prefix) ? options.prefix(service) : options.prefix,
      }, billingAccountSubSection);
    });
  }

  /*
     * Telephony sidebar initilization
     */
  self.initTelephonySubsection = function initTelephonySubsection() {
    return tucTelecomVoip.fetchAll()
      .then((billingAccounts) => {
        // first sort by getDisplayedName
        const sortedBillingAccounts = billingAccounts
          .sort((first, second) => first.getDisplayedName()
            .localeCompare(second.getDisplayedName()));

        sortedBillingAccounts.forEach((billingAccount) => {
          // create subsection object
          const billingAccountSubSection = SidebarMenu.addMenuItem({
            id: billingAccount.billingAccount,
            title: billingAccount.getDisplayedName(),
            state: 'telecom.telephony',
            stateParams: {
              billingAccount: billingAccount.billingAccount,
            },
            allowSubItems: billingAccount.services.length > 0,
          }, self.mainSectionItem);

          /* ----------  Numbers (alias) display  ---------- */

          // first sort numbers of the billingAccount
          const sortedAlias = tucVoipService
            .constructor.sortServicesByDisplayedName(billingAccount.getAlias());

          // add number subsections to billingAccount subsection
          addServiceMenuItems(sortedAlias, {
            state: 'telecom.telephony.alias',
            prefix: $translate.instant('telecom_sidebar_section_telephony_number'),
          }, billingAccountSubSection);

          /* ----------  Lines display  ---------- */

          // first sort lines of the billingAccount
          const sortedLines = tucVoipService
            .constructor.sortServicesByDisplayedName(billingAccount.getLines());

          // display lines except plugAndFax and fax
          const sortedSipLines = filter(sortedLines, line => ['plugAndFax', 'fax', 'voicefax'].indexOf(line.featureType) === -1);

          // add line subsections to billingAccount subsection
          const sipTrunkPrefix = $translate.instant('telecom_sidebar_section_telephony_trunk');
          const sipPrefix = $translate.instant('telecom_sidebar_section_telephony_line');

          addServiceMenuItems(sortedSipLines, {
            state: 'telecom.telephony.line',
            prefix(lineService) {
              return lineService.isSipTrunk() ? sipTrunkPrefix : sipPrefix;
            },
          }, billingAccountSubSection);

          // second get plugAndFax
          const sortedPlugAndFaxLines = tucVoipService.constructor
            .filterPlugAndFaxServices(sortedLines);

          // add plugAndFax subsections to billingAccount subsection
          addServiceMenuItems(sortedPlugAndFaxLines, {
            state: 'telecom.telephony.line',
            prefix: $translate.instant('telecom_sidebar_section_telephony_plug_fax'),
          }, billingAccountSubSection);

          // then get fax
          const sortedFaxLines = tucVoipService.constructor.filterFaxServices(sortedLines);

          // add fax subsections to billingAccount subsection
          addServiceMenuItems(sortedFaxLines, {
            state: 'telecom.telephony.fax',
            prefix: $translate.instant('telecom_sidebar_section_telephony_fax'),
          }, billingAccountSubSection);

          /* ---------- CarrierSip Lines display ----------- */
          const sortedCarrierSipLines = filter(sortedLines, line => line === 'carrierSip');

          addServiceMenuItems(sortedCarrierSipLines, {
            state: 'telecom.telephony.carrierSip',
            prefix: $translate.instant('telecom_sidebar_section_telephony_carrier_sip'),
          }, billingAccountSubSection);
        });
      });
  };

  self.init = function init() {
    self.mainSectionItem = SidebarMenu.addMenuItem({
      title: $translate.instant('telecom_sidebar_section_telephony'),
      error: $translate.instant('telecom_sidebar_load_error'),
      id: 'telecom-telephony-section',
      category: 'telephony',
      icon: 'ovh-font ovh-font-phone',
      allowSubItems: true,
      onLoad: self.initTelephonySubsection,
      loadOnState: 'telecom.telephony',
      allowSearch: true,
      infiniteScroll: true,
    });

    return self.mainSectionItem;
  };
});
