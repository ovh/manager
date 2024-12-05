import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';

export default /* @ngInject */ function BillingMessageParserService() {
  const ALERT_LEVELS = {
    SUCCESS: 'alert-success',
    WARNING: 'alert',
    ERROR: 'alert-danger',
  };

  const ALERT_MAP = {
    ERROR: ALERT_LEVELS.ERROR,
    INFO: ALERT_LEVELS.SUCCESS,
    OK: ALERT_LEVELS.SUCCESS,
    PARTIAL: ALERT_LEVELS.WARNING,
    WARNING: ALERT_LEVELS.WARNING,
  };

  /**
   * @param {string} message - text
   * @param {object|string} data - additional data to parse
   * @return {object}
   */
  return function billingMessageParser(message, data) {
    let alertType = '';
    if (!data) {
      return { message, alertType: '' };
    }

    if (data === 'true') {
      return { message, alertType: ALERT_LEVELS.SUCCESS };
    }

    if (!isEmpty(message)) {
      return {
        message,
        alertType: get(ALERT_MAP, data.type, ''),
      };
    }

    if (data.message) {
      return {
        message: `${message}(${data.message})`,
        alertType: ALERT_MAP[data.type] || '',
      };
    }

    if (data.messages && data.messages.length > 0) {
      const messageDetails = data.messages
        .map((_message) => `${_message.id} : ${_message.message}`)
        .join(', ');

      return {
        message: `${message} (${messageDetails})`,
        alertType: ALERT_MAP[data.state] || '',
      };
    }

    if (data.idTask && angular.isString(data.state)) {
      const stateUppercased = data.state.toUpperCase();
      switch (stateUppercased) {
        case 'BLOCKED':
        case 'CANCELLED':
        case 'PAUSED':
        case 'ERROR':
          alertType = 'alert-danger';
          break;
        case 'WAITING_ACK':
        case 'WAITINGACK':
        case 'DOING':
        default:
          alertType = 'alert';
          break;
        case 'TODO':
        case 'DONE':
          alertType = 'alert-success';
          break;
      }
    }

    return { message, alertType };
  };
}
