angular
  .module('managerApp')
  .controller(
    'TelecomTelephonyLineAssistCtrl',
    function TelecomTelephonyLineAssistCtrl(
      $q,
      $translate,
      $stateParams,
      TelephonyMediator,
      TucToast,
    ) {
      const self = this;
      let sectionLine = null;

      self.loading = {
        init: false,
      };

      self.actions = null;

      /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

      function initActions() {
        self.actions = [
          {
            name: 'line_view_logs_new',
            sref: 'telecom.telephony.billingAccount.line.dashboard.assist.logs',
            text: $translate.instant(
              'telephony_line_assist_actions_line_view_logs_new',
            ),
          },
          {
            name: 'line_phone_assistance',
            sref:
              'telecom.telephony.billingAccount.line.dashboard.assist.troubleshooting',
            disabled:
              !sectionLine.hasPhone ||
              sectionLine.phone.brand === 'phone.polycom.ip5000',
            text: $translate.instant(
              'telephony_line_assist_actions_line_phone_assistance',
            ),
          },
          {
            name: 'line_orders_following_up',
            sref:
              'telecom.telephony.billingAccount.line.dashboard.assist.orders',
            text: $translate.instant(
              'telephony_line_assist_actions_line_orders_following_up',
            ),
          },
          {
            name: 'line_sav_rma_status',
            sref: 'telecom.telephony.billingAccount.line.dashboard.assist.rma',
            text: $translate.instant(
              'telephony_line_assist_actions_line_sav_rma_status',
            ),
          },
          {
            name: 'line_contact_support_and_guides',
            main: true,
            picto: 'ovh-font-docs',
            sref:
              'telecom.telephony.billingAccount.line.dashboard.assist.support',
            text: $translate.instant(
              'telephony_line_assist_actions_line_contact_support_and_guides',
            ),
          },
        ];
      }

      function init() {
        self.loading.init = true;

        return TelephonyMediator.getGroup($stateParams.billingAccount)
          .then((group) => {
            sectionLine = group.getLine($stateParams.serviceName);
            return sectionLine.getPhone().then(() => {
              initActions();
            });
          })
          .catch((error) => {
            TucToast.error(
              [
                $translate.instant('telephony_section_load_error'),
                (error && error.message) || '',
              ].join(' '),
            );
            return $q.reject(error);
          })
          .finally(() => {
            self.loading.init = false;
          });
      }

      /* -----  End of INITIALIZATION  ------*/

      init();
    },
  );
