import filter from 'lodash/filter';
import forEach from 'lodash/forEach';
import set from 'lodash/set';
import some from 'lodash/some';
import startsWith from 'lodash/startsWith';

angular
  .module('managerApp')
  .controller(
    'TelecomTelephonyLineCallsCtrl',
    function TelecomTelephonyLineCallsCtrl(
      $translate,
      $stateParams,
      TelephonyMediator,
    ) {
      const self = this;

      self.line = null;
      self.actions = [];

      self.loading = {
        init: true,
      };

      let isTrunkRates = false;

      /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

      function initActions() {
        return [
          {
            name: 'line_manage_filtering_lists_new',
            main: true,
            picto: 'ovh-font-callFilter',
            sref:
              'telecom.telephony.billingAccount.line.dashboard.calls.filtering',
            text: $translate.instant(
              'telephony_line_calls_actions_line_manage_filtering_lists_new',
            ),
            display: true,
            enable: true,
          },
          {
            name: 'line_locking',
            sref:
              'telecom.telephony.billingAccount.line.dashboard.calls.lockOutCall',
            text: $translate.instant(
              'telephony_line_calls_actions_line_locking',
            ),
            display: true,
            enable: true,
          },
          {
            name: 'line_forwardcall',
            main: true,
            sref:
              'telecom.telephony.billingAccount.line.dashboard.calls.forward',
            picto: 'ovh-font-callForwarding',
            text: $translate.instant(
              'telephony_line_calls_actions_line_forwardcall',
            ),
            display: true,
            enable: true,
          },
          {
            name: 'line_displayNumber',
            main: true,
            picto: 'ovh-font-callRestriction',
            sref:
              'telecom.telephony.billingAccount.line.dashboard.calls.line_displayNumber',
            text: $translate.instant(
              'telephony_line_calls_actions_line_displayNumber',
            ),
            display: true,
            enable: true,
          },
          {
            name: 'line_simultaneouslines',
            sref: !isTrunkRates
              ? 'telecom.telephony.billingAccount.line.dashboard.calls.simultaneousLines'
              : 'telecom.telephony.billingAccount.line.dashboard.calls.simultaneousLinesTrunk',
            text: $translate.instant(
              'telephony_line_calls_actions_line_simultaneouslines',
            ),
            display: true,
            enable: ['sipfax', 'priceplan', 'trunk'],
          },
          {
            name: 'line_manage_slots',
            sref:
              'telecom.telephony.billingAccount.line.dashboard.calls.timeCondition',
            text: $translate.instant(
              'telephony_line_calls_actions_line_manage_slots',
            ),
            display: ['priceplan', 'trunk', 'individual'],
            enable: ['priceplan', 'trunk'],
          },
          {
            name: 'line_calendar',
            sref:
              'telecom.telephony.billingAccount.line.dashboard.calls.events',
            text: $translate.instant(
              'telephony_line_calls_actions_line_calendar',
            ),
            display: ['priceplan', 'trunk', 'individual'],
            enable: ['priceplan', 'trunk'],
          },
          {
            name: 'line_callWaiting',
            sref:
              'telecom.telephony.billingAccount.line.dashboard.calls.callWaiting',
            text: $translate.instant(
              'telephony_line_calls_actions_line_callWaiting',
            ),
            display: true,
            enable: ['sipfax', 'priceplan', 'voicefax', 'individual'],
          },
          {
            name: 'line_abbreviated_numbers',
            main: true,
            picto: 'ovh-font-abbreviatedNumber',
            sref:
              'telecom.telephony.billingAccount.line.dashboard.calls.abbreviatedNumbers',
            text: $translate.instant(
              'telephony_line_calls_actions_line_abbreviated_numbers',
            ),
            display: true,
            enable: !self.line.isIndividual(),
          },
          {
            name: 'line_click2call',
            sref:
              'telecom.telephony.billingAccount.line.dashboard.calls.click2call',
            text: $translate.instant(
              'telephony_line_calls_actions_line_click2call',
            ),
            display: true,
            enable: ['sipfax', 'priceplan', 'voicefax'],
          },
          {
            name: 'line_external_number_display',
            sref:
              'telecom.telephony.billingAccount.line.dashboard.calls.externalNumber',
            text: $translate.instant(
              'telephony_line_calls_actions_line_external_number_display',
            ),
            display: ['trunk'],
            enable: ['trunk'],
          },
        ];
      }

      function init() {
        return TelephonyMediator.getGroup($stateParams.billingAccount)
          .then((group) => group.getLine($stateParams.serviceName))
          .then((line) => {
            self.line = line;

            isTrunkRates = some(line.offers, (offer) =>
              startsWith(offer, 'voip.main.offer.fr.trunk.rates'),
            );

            self.actions = filter(initActions(), (action) => {
              let display = action.display === true;
              let enable = action.enable === true;
              if (action.display !== true) {
                forEach(action.display, (offer) => {
                  if (offer === 'trunk') {
                    if (line.isTrunk()) {
                      display = true;
                    }
                  } else if (line.isOffer(offer)) {
                    display = true;
                  }
                });
              }
              if (action.enable !== true) {
                forEach(action.enable, (offer) => {
                  if (offer === 'trunk') {
                    if (line.isTrunk()) {
                      enable = true;
                    }
                  } else if (line.isOffer(offer)) {
                    enable = true;
                  }
                });
              }
              set(action, 'disabled', !enable);
              return display;
            });
            return line;
          })
          .finally(() => {
            self.loading.init = false;
          });
      }

      /* -----  End of INITIALIZATION  ------*/

      init();
    },
  );
