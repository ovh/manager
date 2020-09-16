import { SMS_COMPOSE } from '../../sms/compose/telecom-sms-sms-compose.constant';
import { SENDER_TYPES } from './sms-configuration.constant';

export default class {
  static mustDisplayAdvice(sender) {
    return (
      sender &&
      (sender.sender === SMS_COMPOSE.shortNumber ||
        (/^[0-9+]*$/.test(sender) && sender.type !== SENDER_TYPES.VIRTUAL))
    );
  }
}
