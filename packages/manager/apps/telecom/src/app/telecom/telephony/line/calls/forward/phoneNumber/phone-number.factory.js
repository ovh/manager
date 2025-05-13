import assignIn from 'lodash/assignIn';

export default /* @ngInject */ () => {
  /**
   * Phone number object
   * @param {Object} data properties
   */
  const TelecomTelephonyLineCallsForwardPhoneNumber = function TelecomTelephonyLineCallsForwardPhoneNumber(
    data,
  ) {
    assignIn(this, data);
    if (this.description === this.serviceName) {
      this.description = '';
    }

    // All sip lines with phones will be treated as plug&phone
    if (this.hasPhone && (this.type === 'line' || this.type === 'voicemail')) {
      this.type = 'plug&phone';
    }
  };

  TelecomTelephonyLineCallsForwardPhoneNumber.prototype.toString = function toString() {
    return this.description
      ? this.description + ['(', ')'].join(this.serviceName)
      : this.serviceName;
  };

  Object.defineProperty(
    TelecomTelephonyLineCallsForwardPhoneNumber.prototype,
    'serviceName',
    {
      get() {
        return this.formatedNumber;
      },
      set(number) {
        if (number) {
          const matcher = number.match(
            /^(00(\d{1,3})|\+(\d{1,3})\s?\(0\))?([\d\s]*)$/,
          );
          if (matcher && (matcher[2] || matcher[3]) && matcher[4]) {
            this.formatedNumber = `00${matcher[3] ||
              matcher[2]}${matcher[4].replace(/\s/g, '')}`; // ("0033" + matcher[3] + matcher[4]).replace(/\s/g, "");
          } else {
            this.formatedNumber = number;
          }
        } else {
          this.formatedNumber = number;
        }
      },
      enumerable: true,
    },
  );

  return TelecomTelephonyLineCallsForwardPhoneNumber;
};
