import moment from 'moment';
import { GUIDE_URL } from '../../training.constants';

export default class PciTrainingJobsInfoController {
  /* @ngInject */
  constructor(
    CucCloudMessage,
    CucRegionService,
    $interval,
    PciProjectTrainingJobService,
  ) {
    this.CucCloudMessage = CucCloudMessage;
    this.CucRegionService = CucRegionService;
    this.$interval = $interval;
    this.PciProjectTrainingJobService = PciProjectTrainingJobService;
  }

  $onDestroy() {
    if (this.interval !== null) {
      this.$interval.cancel(this.interval);
    }
    if (this.pullInterval !== null) {
      this.$interval.cancel(this.pullInterval);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  isError(state) {
    return state === 'FAILED' || state === 'ERROR';
  }

  $onInit() {
    this.guideUrl = GUIDE_URL;

    this.unitPrice = this.getPrice(1);
    this.unitTax = this.getTax(1);
    const totalHour = this.job.status.duration / 3600;
    this.price = this.unitPrice * totalHour;
    this.tax = this.unitTax * totalHour;

    this.loadMessages();

    if (!this.job.isTerminal()) {
      this.pullInterval = this.$interval(() => {
        this.PciProjectTrainingJobService.get(this.projectId, this.jobId).then(
          (job) => {
            this.job = job;

            if (this.job.isTerminal()) {
              this.$interval.cancel(this.pullInterval);
            }
          },
        );
      }, 5000);
    }

    if (this.job.status.state === 'RUNNING') {
      this.start = moment();
      this.interval = this.$interval(() => {
        let totalHourRecalculated = this.job.status.duration / 3600;

        if (this.start) {
          totalHourRecalculated += moment().diff(this.start) / (1000 * 3600);
        }

        this.price = this.unitPrice * totalHourRecalculated;
        this.tax = this.unitTax * totalHourRecalculated;
      }, 1000);
    }
  }

  getDuration() {
    let { duration } = this.job.status;
    if (this.start) {
      duration += moment().diff(this.start) / 1000;
    }

    if (duration < 60) {
      // eslint-disable-next-line no-underscore-dangle
      return moment(moment.duration(duration, 'seconds')._data).format('ss[s]');
    }
    if (duration < 3600) {
      // eslint-disable-next-line no-underscore-dangle
      return moment(moment.duration(duration, 'seconds')._data).format(
        'mm[m]:ss[s]',
      );
    }

    // eslint-disable-next-line no-underscore-dangle
    return moment(moment.duration(duration, 'seconds')._data).format(
      'HH[h]:mm[m]:ss[s]',
    );
  }

  loadMessages() {
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.training.jobs.info',
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }
}
