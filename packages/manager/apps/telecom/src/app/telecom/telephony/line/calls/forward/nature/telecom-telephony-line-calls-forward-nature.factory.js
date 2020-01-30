angular
  .module('managerApp')
  .factory('TelecomTelephonyLineCallsForwardNature', ($translate) => {
    /**
     * Nature of number (fax, voicemail, number)
     * @param {String} elt Type of number
     */
    const TelecomTelephonyLineCallsForwardNature = function TelecomTelephonyLineCallsForwardNature(
      elt,
    ) {
      this.label = $translate.instant(
        `telephony_line_actions_line_calls_forward_${elt}`,
      );
      this.value = elt;
      switch (elt) {
        case 'number':
          this.types = ['number', 'line', 'plug&phone', 'fax', 'voicemail'];
          break;
        case 'voicemail':
          this.types = ['voicemail', 'fax', 'plug&phone'];
          break;
        case 'fax':
          this.types = ['fax', 'plug&phone'];
          break;
        default:
          this.types = [elt];
      }
    };

    return TelecomTelephonyLineCallsForwardNature;
  });
