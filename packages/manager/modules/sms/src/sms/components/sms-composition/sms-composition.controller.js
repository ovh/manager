import debounce from 'lodash/debounce';

import { SENDER_TYPES } from '../sms-configuration/sms-configuration.constant';
import { SMS_COMPOSE } from '../../sms/compose/telecom-sms-sms-compose.constant';

export default class SmsCompositionController {
  /* @ngInject */
  constructor($http, $scope, $timeout, TucSmsMediator) {
    this.$http = $http;
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.TucSmsMediator = TucSmsMediator;
    this.getMessageDetailsDebounced = debounce(
      () => this.getMessageDetails(),
      200,
    );
  }

  $onInit() {
    this.messageDetails = {};
    this.$scope.$watch(
      () => this.model?.sender?.sender,
      (oldSender, newSender) => {
        if (newSender !== oldSender) {
          this.getMessageDetails();
        }
      },
    );
  }

  getMessageDetails() {
    // timeout is here because the onChange event of the oui-textarea
    // is triggered before the model is updated
    this.$timeout(() => {
      const isShort =
        this.model.sender &&
        SmsCompositionController.isShortNumber(this.model.sender)
          ? true
          : !!this.model.noStopClause;

      if (!this.model.message) {
        this.model.messageDetails = this.TucSmsMediator.getSmsInfoText(
          this.model.message,
          !isShort,
        );
        return this.model.messageDetails;
      }

      return this.$http
        .post(`/sms/estimate`, {
          message: this.model.message,
          noStopClause: isShort,
          senderType: SmsCompositionController.isShortNumber(this.model.sender)
            ? 'shortcode'
            : this.model.sender.type,
        })
        .then(({ data }) => {
          this.model.messageDetails = {};
          this.model.messageDetails.remainingCharacters =
            data.maxCharactersPerPart * data.parts - data.characters;
          this.model.messageDetails.defaultSize = data.maxCharactersPerPart;
          this.model.messageDetails.equivalence = data.parts;
          // TODO: Align both Enum `sms.EncodingEnum` and `sms.CodingEnum`.
          // Since `charactersClass` could be `7bits` or `unicode`, we manually
          // set the expected `coding`.
          this.model.messageDetails.coding =
            data.charactersClass === '7bits' ? '7bit' : '8bit';

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
