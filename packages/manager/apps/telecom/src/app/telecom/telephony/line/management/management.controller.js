import get from 'lodash/get';

export default /* @ngInject */ function TelecomTelephonyLineManagementCtrl(
  $q,
  $translate,
  $stateParams,
  TelecomMediator,
  TelephonyMediator,
  OvhApiTelephony,
) {
  const self = this;

  this.loading = {
    init: true,
  };

  self.actions = [];

  /*= =====================================
    =            INITIALIZATION           =
    ======================================= */

  function initAction(taskCount, offerCount, isInXdslPack) {
    const actions = [
      {
        name: 'line_details_offer',
        main: true,
        picto: 'ovh-font-details',
        sref: 'telecom.telephony.billingAccount.line.detailsOffer',
        text: $translate.instant(
          'telephony_line_management_actions_line_details_offer',
        ),
      },
      {
        name: 'line_sip_password',
        sref: 'telecom.telephony.billingAccount.line.password',
        disabled: !self.canSipPassword,
        text: $translate.instant(
          'telephony_line_management_actions_line_sip_password',
        ),
      },
      {
        name: 'line_sip_domain_management',
        sref: 'telecom.telephony.billingAccount.line.domain',
        disabled: !TelecomMediator.isVip,
        text: $translate.instant(
          'telephony_line_management_actions_line_sip_domain_management',
        ),
      },
      get(self.line, 'phone.protocol') === 'mgcp'
        ? {
            name: 'line_manage_mgcp_ip_restriction',
            disabled: !self.line.hasPhone,
            sref: 'telecom.telephony.billingAccount.line.mgcpIpRestriction',
            text: $translate.instant(
              'telephony_line_management_actions_line_mgcp_ip_restriction',
            ),
          }
        : {
            name: 'line_sip_ips_restrictions',
            sref: 'telecom.telephony.billingAccount.line.restrictions',
            disabled: get(self.line, 'phone.protocol') === 'mgcp',
            text: $translate.instant(
              'telephony_line_management_actions_line_sip_ips_restrictions',
            ),
          },
      {
        name: 'line_language',
        sref: 'telecom.telephony.billingAccount.line.language',
        text: $translate.instant(
          'telephony_line_management_actions_line_language',
        ),
      },
      {
        name: 'line_resume_offer',
        disabled: offerCount === 0 || self.line.isTrunk(),
        sref: 'telecom.telephony.billingAccount.line.offerChange',
        text: $translate.instant(
          'telephony_line_management_actions_line_resume_offer',
        ),
      },
      {
        name: 'line_to_number',
        sref: 'telecom.telephony.billingAccount.line.convert',
        disabled: isInXdslPack || self.line.isVoicefax(),
        text: $translate.instant(
          'telephony_line_management_actions_line_to_number',
        ),
      },
    ];

    if (taskCount) {
      actions.push({
        name: 'line_cancel_delete_line_new',
        sref: 'telecom.telephony.billingAccount.line.terminate.cancel',
        text: $translate.instant(
          'telephony_line_management_actions_line_cancel_delete_line_new',
        ),
      });
    } else {
      actions.push({
        name: 'line_delete_line_new',
        sref: 'telecom.telephony.billingAccount.line.terminate',
        text: $translate.instant(
          'telephony_line_management_actions_line_delete_line_new',
        ),
      });
    }
    self.actions = actions;
  }

  function getTasks() {
    return OvhApiTelephony.Service()
      .OfferTask()
      .v6()
      .query({
        billingAccount: $stateParams.billingAccount,
        serviceName: $stateParams.serviceName,
        action: 'termination',
        status: 'todo',
      }).$promise;
  }

  function getOffers() {
    return self.line.getAvailableOffers();
  }

  function init() {
    let taskCount = 0;
    let offerCount = 0;
    let isInXdslPack = false;

    self.loading.init = true;

    return TelephonyMediator.getGroup($stateParams.billingAccount).then(
      (group) => {
        self.line = group.getLine($stateParams.serviceName);

        return $q
          .allSettled([
            self.line.getPhone(),
            getTasks().then((tasks) => {
              taskCount = tasks.length;
            }),
            getOffers().then((offers) => {
              offerCount = offers.length;
            }),
            OvhApiTelephony.Line()
              .v6()
              .canChangePassword({
                billingAccount: $stateParams.billingAccount,
                serviceName: $stateParams.serviceName,
              })
              .$promise.then((result) => {
                if (result && result.value) {
                  self.canSipPassword = true;
                }
                return result;
              }),
            self.line.isIncludedInXdslPack().then((inPack) => {
              isInXdslPack = inPack;
            }),
          ])
          .then(() => {
            initAction(taskCount, offerCount, isInXdslPack);
          })
          .catch(() => {
            initAction(taskCount, offerCount, isInXdslPack);
          })
          .finally(() => {
            self.loading.init = false;
          });
      },
    );
  }

  /* -----  End of INITIALIZATION  ------*/

  init();
}
