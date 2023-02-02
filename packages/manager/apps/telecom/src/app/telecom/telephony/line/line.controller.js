import find from 'lodash/find';

export default /* @ngInject */ function TelecomTelephonyLineCtrl(
  $q,
  $stateParams,
  $translate,
  answerLink,
  assistLink,
  callsLink,
  contactLink,
  currentActiveLink,
  consumptionLink,
  faxLink,
  lineLink,
  phoneLink,
  shellClient,
  TelephonyMediator,
  tonesLink,
  TucToast,
) {
  const self = this;

  self.loading = {
    init: false,
    save: false,
  };

  self.line = null;
  self.fax = null;
  self.links = null;

  self.lineLink = lineLink;
  self.currentActiveLink = currentActiveLink;
  self.consumptionLink = consumptionLink;
  self.callsLink = callsLink;
  self.tonesLink = tonesLink;
  self.answerLink = answerLink;
  self.phoneLink = phoneLink;
  self.assistLink = assistLink;
  self.contactLink = contactLink;
  self.faxLink = faxLink;

  /*= ==============================
    =            ACTIONS            =
    =============================== */

  self.lineNameSave = function lineNameSave(newServiceDescription) {
    self.line.startEdition();
    self.line.description = newServiceDescription;
    return self.line.save().then(
      () => {
        self.line.stopEdition();
        shellClient.ux.updateMenuSidebarItemLabel(
          self.line.serviceName,
          newServiceDescription,
        );
      },
      (error) => {
        self.line.stopEdition(true);
        TucToast.error(
          [
            $translate.instant('telephony_line_rename_error', $stateParams),
            error.data.message,
          ].join(' '),
        );
        return $q.reject(error);
      },
    );
  };

  /* -----  End of ACTIONS  ------*/

  /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

  function init() {
    self.loading.init = true;

    return TelephonyMediator.getGroup($stateParams.billingAccount)
      .then((group) => {
        const promises = [];
        self.line = group.getLine($stateParams.serviceName);
        self.fax = find(group.fax, { serviceName: $stateParams.serviceName });

        // check if line is terminating
        promises.push(
          self.line.getTerminating().then((terminating) => {
            self.terminating = terminating;
          }),
        );

        // check if line is converting to alias
        promises.push(
          self.line.getConvertionTask().then((task) => {
            self.converting = task;
          }),
        );

        self.links = {
          contactDetails: TelephonyMediator.getV6ToV4RedirectionUrl(
            'line.line_manage_directory',
          ),
        };

        // check if has fax option
        self.disableFaxOptionTab =
          !(self.line.isPlugNFax || self.fax || self.line.hasFaxCapabilities) ||
          self.line.isTrunk();

        return $q.all(promises);
      })
      .finally(() => {
        self.loading.init = false;
      });
  }

  /* -----  End of INITIALIZATION  ------*/

  init();
}
