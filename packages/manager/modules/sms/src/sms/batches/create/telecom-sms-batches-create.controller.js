import moment from 'moment';
import { SMS_COMPOSE } from '../../sms/compose/telecom-sms-sms-compose.constant';

export default class SmsBatchesCreateController {
  /* @ngInject */
  constructor($q) {
    this.$q = $q;
  }

  $onInit() {
    this.sms = {
      sender: this.senders[0],
      contacts: [],
      receivers: [],
      immediate: true,
    };
  }

  static canDisplayEstimation(sms) {
    return (
      ((sms.uniqueReceiver && sms.uniqueReceiver !== '') ||
        sms.receivers.length > 0 ||
        sms.contacts.length > 0) &&
      sms.message
    );
  }

  static buildBatchParams(model) {
    const buildParams = {};

    return Object.assign(
      buildParams,
      model.class ? { class: model.class.value } : null,
      model.sender.sender === SMS_COMPOSE.shortNumber
        ? { senderForResponse: true }
        : { from: model.sender.sender },
      { message: model.message },
      { name: model.batchName },
      { noStop: !!model.noStopClause },
      {
        to: [
          model.uniqueReceiver,
          ...model.contacts.map(({ phonenumber }) => phonenumber),
        ].filter((phoneNumber) => !!phoneNumber),
      },
      model.immediate
        ? null
        : {
            deferred: moment(
              `${model.delayedDate} ${model.delayedTime}`,
              'DD/MM/YYYY hh:mm',
            ).format('YYYY-MM-DDThh:mm:ssZ'),
          },
    );
  }

  validateBatch() {
    this.isValidating = true;
    const batchParams = SmsBatchesCreateController.buildBatchParams(this.sms);

    // First call to send to numeric receivers
    const createBatchToPromises =
      batchParams.to.length > 0 ? [this.createBatch(batchParams)] : [];

    // Calls for receivers list with slotId
    const createBatchSlotsPromises = this.sms.receivers.map(({ slotId }) =>
      this.createBatch({
        ...batchParams,
        to: null,
        slotId,
      }),
    );

    return this.$q
      .all([...createBatchToPromises, ...createBatchSlotsPromises])
      .then(() => this.onSuccess())
      .catch((error) => {
        this.error = error;
      })
      .finally(() => {
        this.isValidating = false;
      });
  }
}
