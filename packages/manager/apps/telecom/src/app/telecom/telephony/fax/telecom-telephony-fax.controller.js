angular
  .module('managerApp')
  .controller('TelecomTelephonyFaxCtrl', function TelecomTelephonyFaxCtrl(
    $q,
    $stateParams,
    $translate,
    assistLink,
    atInternet,
    contactLink,
    consumptionLink,
    currentActiveLink,
    faxDashboardLink,
    faxLink,
    TelecomMediator,
    TelephonyMediator,
    SidebarMenu,
    TucToast,
    voicemailLink,
  ) {
    const self = this;

    self.loading = {
      init: false,
    };

    self.fax = null;
    self.actions = null;
    self.terminationTask = null;

    self.consumptionLink = consumptionLink;
    self.currentActiveLink = currentActiveLink;
    self.faxDashboardLink = faxDashboardLink;
    self.voicemailLink = voicemailLink;
    self.faxLink = faxLink;
    self.contactLink = contactLink;
    self.assistLink = assistLink;

    /* ===============================
    =            ACTIONS            =
    =============================== */

    self.faxNameSave = function faxNameSave(newServiceDescription) {
      self.fax.startEdition();
      self.fax.description = newServiceDescription;
      return self.fax.save().then(
        () => {
          self.fax.stopEdition();
          SidebarMenu.updateItemDisplay(
            {
              title: self.fax.getDisplayedName(),
            },
            self.fax.serviceName,
            'telecom-telephony-section',
            self.fax.billingAccount,
          );
        },
        (error) => {
          self.fax.stopEdition(true);
          TucToast.error(
            [
              $translate.instant('telephony_fax_rename_error', $stateParams),
              error.data.message,
            ].join(' '),
          );
          return $q.reject(error);
        },
      );
    };

    /* -----  End of ACTIONS  ------ */

    /* =====================================
    =            INITIALIZATION            =
    ====================================== */

    self.$onInit = function $onInit() {
      self.loading.init = true;

      return TelephonyMediator.getGroup($stateParams.billingAccount)
        .then((group) => {
          self.fax = group.getFax($stateParams.serviceName);

          return self.fax.getTerminationTask().then((task) => {
            self.terminationTask = task;
          });
        })
        .finally(() => {
          self.loading.init = false;

          atInternet.trackPage({
            name: 'Fax',
            type: 'navigation',
            level2: 'Telecom',
            chapter: 'telecom',
          });
        });
    };

    /* -----  End of INITIALIZATION  ------ */
  });
