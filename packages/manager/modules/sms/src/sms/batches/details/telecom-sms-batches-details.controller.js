import get from 'lodash/get';

export default class SmsBatchesHistoryDetailsController {
  /* @ngInject */
  constructor($q, SmsService) {
    this.$q = $q;
    this.SmsService = SmsService;
  }

  $onInit() {
    this.isLoading = true;

    return this.loadAllPttsDetails(this.outgoingSms)
      .then((enrichedOutgoing) => {
        this.outgoingSms = enrichedOutgoing;
      })
      .catch((error) => {
        this.error = get(error, 'data.message', error.message);
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  loadAllPttsDetails(outgoingSms) {
    return this.$q.all(
      outgoingSms.map((outgoing) =>
        this.getPttDetails(outgoing).then((pttDetails) => ({
          ...outgoing,
          status: pttDetails.comment,
        })),
      ),
    );
  }

  refreshData() {
    this.isLoading = true;
    return this.getOutgoingSms(this.batch)
      .then((outgoingSms) => this.loadAllPttsDetails(outgoingSms))
      .then((enrichedOutgoing) => {
        this.outgoingSms = enrichedOutgoing;
      })
      .catch((error) => {
        this.error = get(error, 'data.message', error.message);
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  downloadLogs(batch) {
    this.isDownloading = true;

    return this.SmsService.getDocument(
      this.serviceName,
      moment(batch.createdAt).format(),
      moment().format(),
      batch.id,
    )
      .catch((error) => {
        this.error = get(error, 'data.message', error.message);
      })
      .finally(() => {
        this.isDownloading = false;
      });
  }
}
