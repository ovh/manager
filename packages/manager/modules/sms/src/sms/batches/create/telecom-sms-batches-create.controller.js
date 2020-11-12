import moment from 'moment';
import { SMS_COMPOSE } from '../../sms/compose/telecom-sms-sms-compose.constant';

import { CREATE_BATCH_HIT } from './telecom-sms-batches-create.constants';

export default class SmsBatchesCreateController {
  /* @ngInject */
  constructor($q, $translate) {
    this.$q = $q;
    this.$translate = $translate;
  }

  $onInit() {
    this.sms = {
      sender: this.senders[0],
      contacts: [],
      receivers: [],
      immediate: true,
    };

    this.classes = this.smsClasses.map((smsClass) => ({
      label: this.$translate.instant(`sms_options_type_${smsClass}`),
      value: smsClass,
    }));
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
              'DD/MM/YYYY HH:mm',
            ).format('YYYY-MM-DDTHH:mm:ssZ'),
          },
    );
  }

  validateBatch() {
    this.isValidating = true;
    this.trackClick(CREATE_BATCH_HIT);
    const batchParams = SmsBatchesCreateController.buildBatchParams(this.sms);

    // First call to send to numeric receivers
    const createBatchToPromises =
      batchParams.to.length > 0 ? [this.createBatch(batchParams)] : [];

    // Calls for receivers list with slotId
    const createBatchSlotsPromises = this.sms.receivers.map(({ slotId }) =>
      this.createBatch({
        ...batchParams,
        to: [],
        slotID: slotId.toString(),
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
