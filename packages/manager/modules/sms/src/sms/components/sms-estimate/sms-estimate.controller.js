export default class SmsEstimateController {
  static getReceiversCount(model) {
    const hasUniqueReceiver =
      model.uniqueReceiver != null && model.uniqueReceiver !== '';

    const receiversCount = model.receivers.reduce(
      (count, receiver) => count + receiver.records,
      hasUniqueReceiver ? 1 : 0,
    );

    const contactsCount = model.contacts.length;
    return receiversCount + contactsCount;
  }

  getEstimationCreditRemaining() {
    const receiversCount = SmsEstimateController.getReceiversCount(this.model);

    return (
      this.service.creditsLeft -
      receiversCount * this.model.messageDetails.equivalence
    );
  }
}
