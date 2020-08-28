import get from 'lodash/get';

angular
  .module('managerApp')
  .controller('TelecomTelephonyFaxFaxCtrl', function TelecomTelephonyFaxFaxCtrl(
    $q,
    $stateParams,
    $translate,
    TelecomMediator,
    TelephonyMediator,
    TucToast,
  ) {
    const self = this;

    self.loading = {
      init: false,
    };

    self.fax = null;
    self.actions = null;

    /* =====================================
    =            INITIALIZATION            =
    ====================================== */

    function initActions() {
      const actions = [
        {
          name: 'line_fax_password',
          sref: 'telecom.telephony.billingAccount.fax.dashboard.fax.password',
          text: $translate.instant('telephony_fax_fax_action_password'),
        },
        {
          name: 'line_fax_options',
          sref: 'telecom.telephony.billingAccount.fax.dashboard.fax.settings',
          text: $translate.instant('telephony_fax_fax_action_options'),
        },
        {
          name: 'line_fax_white_label_domains',
          sref:
            'telecom.telephony.billingAccount.fax.dashboard.fax.customDomains',
          text: $translate.instant(
            'telephony_fax_fax_action_white_label_domains',
          ),
          disabled: !TelecomMediator.isVip,
        },
        {
          name: 'line_fax_filtering',
          sref: 'telecom.telephony.billingAccount.fax.dashboard.fax.filtering',
          text: $translate.instant('telephony_fax_fax_action_filtering'),
        },
        {
          name: 'line_fax_campaign_management',
          sref: 'telecom.telephony.billingAccount.fax.dashboard.fax.campaigns',
          text: $translate.instant(
            'telephony_fax_fax_action_campaign_management',
          ),
        },
        {
          name: 'line_convert_to_ecofax_pro',
          sref:
            'telecom.telephony.billingAccount.fax.dashboard.fax.convertToVoicefax',
          text: $translate.instant(
            'telephony_fax_fax_action_convert_to_voicefax',
          ),
        },
      ];

      self.actions = actions;
    }

    self.$onInit = function $onInit() {
      self.loading.init = true;

      return TelephonyMediator.getGroup($stateParams.billingAccount)
        .then((group) => {
          self.fax = group.getFax($stateParams.serviceName);
          initActions();
        })
        .catch((error) => {
          TucToast.error(
            [
              $translate.instant('telephony_fax_loading_error'),
              get(error, 'data.message', ''),
            ].join(' '),
          );
          return $q.reject(error);
        })
        .finally(() => {
          self.loading.init = false;
        });
    };

    /* -----  End of INITIALIZATION  ------ */
  });
