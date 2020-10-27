import snakeCase from 'lodash/snakeCase';

export default /* @ngInject */ ($translate) => {
  /**
   * Forward object
   * @param {Object} options All options from API
   * @param {String} key     Type of forward
   */
  const TelecomTelephonyLineCallsForward = function TelecomTelephonyLineCallsForward(
    options,
    key,
  ) {
    this.type = key;
    this.label = $translate.instant(
      `telephony_line_actions_line_calls_forward_${snakeCase(key)}_title`,
    );
    this.nature = options[`forward${key}Nature`];
    const number = options[`forward${key}Number`];
    if (number && number.type) {
      if (number.type === 'external') {
        this.externalNumber = options[`forward${key}Number`];
      } else {
        this.number = options[`forward${key}Number`];
      }
    }
    this.enable = options[`forward${key}`];
    this.delayLabelBefore = $translate.instant(
      `telephony_line_actions_line_calls_forward_${snakeCase(key)}_before`,
    );
    this.delayLabelAfter = $translate.instant(
      `telephony_line_actions_line_calls_forward_${snakeCase(key)}_after`,
    );
    this.delay = options[`forward${key}Delay`];
    this.hasDelay = key === 'NoReply';
    this.master = key === 'Unconditional';
  };

  TelecomTelephonyLineCallsForward.prototype.getCurrentNumber = function getCurrentNumber() {
    return this.nature.value === 'external' ? this.externalNumber : this.number;
  };

  /**
   * Get the foot print to detect change to save
   * @type {String}
   */
  Object.defineProperty(
    TelecomTelephonyLineCallsForward.prototype,
    'footPrint',
    {
      get() {
        return [
          this.nature.value,
          this.getCurrentNumber()
            ? this.getCurrentNumber().serviceName
            : 'null',
          this.enable,
          this.delay,
        ].join('#');
      },
      set: angular.noop,
    },
  );

  /**
   * Get the saving data
   * @type {String}
   */
  Object.defineProperty(
    TelecomTelephonyLineCallsForward.prototype,
    'saveData',
    {
      get() {
        const result = {};
        result[`forward${this.type}`] = this.enable;
        const number = this.getCurrentNumber();
        result[`forward${this.type}Number`] = number ? number.serviceName : '';
        result[`forward${this.type}Nature`] =
          this.nature.value === 'external' ? 'number' : this.nature.value;
        if (this.hasDelay) {
          result[`forward${this.type}Delay`] = this.delay;
        }
        return result;
      },
      set: angular.noop,
    },
  );

  return TelecomTelephonyLineCallsForward;
};
