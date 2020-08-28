import get from 'lodash/get';

angular
  .module('managerApp')
  .controller(
    'TelecomTelephonyFaxVoicemailCtrl',
    function TelecomTelephonyFaxVoicemailCtrl(
      $q,
      $stateParams,
      $translate,
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
            name: 'fax_voicemail_management',
            sref:
              'telecom.telephony.billingAccount.fax.dashboard.voicemail.management',
            main: true,
            picto: 'ovh-font-messagesRead',
            text: $translate.instant(
              'telephony_group_fax_voicemail_action_management',
            ),
          },
          {
            name: 'fax_voicemail_status',
            sref:
              'telecom.telephony.billingAccount.fax.dashboard.voicemail.activation',
            text: $translate.instant(
              'telephony_group_fax_voicemail_action_status',
            ),
          },
          {
            name: 'fax_voicemail_password',
            sref:
              'telecom.telephony.billingAccount.fax.dashboard.voicemail.password',
            text: $translate.instant(
              'telephony_group_fax_voicemail_action_password',
            ),
          },
          {
            name: 'fax_voicemail_options',
            sref:
              'telecom.telephony.billingAccount.fax.dashboard.voicemail.options',
            text: $translate.instant(
              'telephony_group_fax_voicemail_action_options',
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
    },
  );
