angular
  .module('managerApp')
  .controller(
    'TelecomTelephonyLinePhoneCtrl',
    function TelecomTelephonyLinePhoneCtrl(
      $q,
      $stateParams,
      $translate,
      TelephonyMediator,
    ) {
      const self = this;

      self.actions = null;
      self.line = null;
      self.billingAccount = null;
      self.loading = {
        init: false,
      };

      /*= =====================================
  =            INITIALIZATION            =
  ====================================== */

      function isAllowedOrder(orderName) {
        return !!(
          self.billingAccount.availableOrders &&
          self.billingAccount.availableOrders.indexOf(orderName) > -1
        );
      }

      function initActions() {
        self.actions = [
          {
            name: 'line_details_phon_offer',
            sref: 'telecom.telephony.billingAccount.line.phone.details',
            text: $translate.instant(
              'telephony_line_phone_actions_line_details_phon_offer',
            ),
          },
          {
            name: 'line_codecs_management',
            sref: 'telecom.telephony.billingAccount.line.phone.codec',
            text: $translate.instant(
              'telephony_line_phone_actions_line_codecs_management',
            ),
          },
          {
            name: 'line_plug_and_phone_custom_parameters_list',
            disabled:
              !self.line.phone || self.line.phone.configurations.length === 0,
            sref: 'telecom.telephony.billingAccount.line.phone.configuration',
            text: $translate.instant(
              'telephony_line_phone_actions_line_plug_and_phone_custom_parameters_list',
            ),
          },
          {
            name: 'line_programmable_keys',
            main: true,
            disabled: !self.line.hasPhone,
            picto: 'ovh-font-programmableKeys',
            sref:
              'telecom.telephony.billingAccount.line.phone.programmableKeys',
            text: $translate.instant(
              'telephony_line_phone_actions_line_programmable_keys',
            ),
          },
          {
            name: 'line_phone_reboot',
            disabled: !self.line.hasPhone,
            sref: 'telecom.telephony.billingAccount.line.phone.reboot',
            text: $translate.instant(
              'telephony_line_phone_actions_line_phone_reboot',
            ),
          },
          {
            name: 'line_phone_order_plug_and_phone',
            sref: 'telecom.telephony.billingAccount.line.phone.order',
            disabled: !self.billingAccount.isNicAdmin,
            text: self.line.hasPhone
              ? $translate.instant(
                  'telephony_line_phone_actions_line_phone_change_plug_and_phone',
                )
              : $translate.instant(
                  'telephony_line_phone_actions_line_phone_order_plug_and_phone',
                ),
          },
          {
            name: 'line_order_accessories',
            sref: 'telecom.telephony.billingAccount.line.phone.accessories',
            disabled: !(
              isAllowedOrder('accessory') || isAllowedOrder('accessories')
            ),
            text: $translate.instant(
              'telephony_line_phone_actions_line_order_accessories',
            ),
          },
          {
            name: 'line_phonebook',
            main: true,
            disabled: !self.line.hasPhone || !self.line.hasSupportsPhonebook,
            picto: 'ovh-font-contacts',
            sref: 'telecom.telephony.billingAccount.line.phone.phonebook',
            text: $translate.instant(
              'telephony_line_phone_actions_line_phonebook',
            ),
          },
        ];
      }

      function init() {
        self.loading.init = true;

        return TelephonyMediator.getGroup($stateParams.billingAccount)
          .then((group) => {
            self.billingAccount = group;
            self.line = self.billingAccount.getLine($stateParams.serviceName);

            return $q
              .allSettled([
                self.line.getPhone(),
                self.line.supportsPhonebook(),
                self.billingAccount.getAvailableOrderNames(),
              ])
              .then(() => {
                initActions();
              });
          })
          .finally(() => {
            self.loading.init = false;
          });
      }

      /* -----  End of INITIALIZATION  ------*/

      init();
    },
  );
