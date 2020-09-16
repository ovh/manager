import { SENDER_TYPES } from '../sms-configuration/sms-configuration.constant';
import { SMS_COMPOSE } from '../../sms/compose/telecom-sms-sms-compose.constant';

export default class SmsCompositionController {
  /* @ngInject */
  constructor(TucSmsMediator) {
    this.TucSmsMediator = TucSmsMediator;
  }

  $onInit() {
    this.messageDetails = {};
  }

  getMessageDetails(noStopValue) {
    const isShort =
      this.model.sender &&
      SmsCompositionController.isShortNumber(this.model.sender)
        ? true
        : this.model.noStopClause;
    const suffix = noStopValue !== undefined ? noStopValue : isShort;
    this.model.messageDetails = this.TucSmsMediator.getSmsInfoText(
      this.model.message,
      !suffix,
    );
  }

  canHaveSTOPAnswer() {
    const isRealNumber =
      /^[0-9+]*$/.test(this.model.sender) &&
      !this.isSenderVirtualNumber(this.model.sender);

    return (
      !isRealNumber &&
      !SmsCompositionController.isShortNumber(this.model.sender) &&
      this.displayCommercialClause()
    );
  }

  displayCommercialClause() {
    return this.user.ovhSubsidiary === 'FR';
  }

  static isShortNumber(sender) {
    return sender && sender.sender === SMS_COMPOSE.shortNumber;
  }

  static isSenderVirtualNumber(sender) {
    return sender && sender.type === SENDER_TYPES.virtual;
  }
}
