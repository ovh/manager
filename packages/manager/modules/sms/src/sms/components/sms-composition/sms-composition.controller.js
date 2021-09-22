import { SENDER_TYPES } from '../sms-configuration/sms-configuration.constant';
import { SMS_COMPOSE } from '../../sms/compose/telecom-sms-sms-compose.constant';

export default class SmsCompositionController {
  /* @ngInject */
  constructor($http, $timeout, TucSmsMediator) {
    this.$http = $http;
    this.$timeout = $timeout;
    this.TucSmsMediator = TucSmsMediator;
  }

  $onInit() {
    this.messageDetails = {};
  }

  getMessageDetails(noStopValue) {
    // timeout is here because the onChange event of the oui-textarea
    // is triggered before the model is updated
    this.$timeout(() => {
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

      if (!this.model.message) {
        return this.model.messageDetails;
      }

      return this.$http
        .post(`/sms/estimate`, {
          message: this.model.message,
          noStopClause: suffix,
          senderType: SmsCompositionController.isShortNumber(this.model.sender)
            ? 'shortcode'
            : this.model.sender.type,
        })
        .then(({ data }) => {
          this.model.messageDetails.remainingCharacters =
            data.maxCharactersPerPart - data.characters;
          this.model.messageDetails.defaultSize = data.maxCharactersPerPart;
          this.model.messageDetails.equivalence = data.parts;
          this.model.messageDetails.coding = data.charactersClass;

          return this.model.messageDetails;
        })
        .catch(() => {
          return this.model.messageDetails;
        });
    });
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
