import moment from 'moment';
import { GUIDE_URL } from '../../training.constants';

export default class PciTrainingJobsInfoController {
  /* @ngInject */
  constructor(CucCloudMessage, CucRegionService, $interval) {
    this.CucCloudMessage = CucCloudMessage;
    this.CucRegionService = CucRegionService;
    this.$interval = $interval;
  }

  $onDestroy() {
    if (this.interval !== null) {
      this.$interval.cancel(this.interval);
    }
  }

  $onInit() {
    this.guideUrl = GUIDE_URL;

    this.unitPrice = this.getPrice(1);
    this.unitTax = this.getTax(1);
    const totalHour = this.job.totalRuntime / 3600;
    this.price = this.unitPrice * totalHour;
    this.tax = this.unitTax * totalHour;

    this.loadMessages();

    if (this.job.state === 'RUNNING') {
      this.start = moment();
      this.interval = this.$interval(() => {
        let totalHourRecalculated = this.job.totalRuntime / 3600;

        if (this.start) {
          totalHourRecalculated += moment().diff(this.start) / (1000 * 3600);
        }

        this.price = this.unitPrice * totalHourRecalculated;
        this.tax = this.unitTax * totalHourRecalculated;
      }, 1000);
    }
  }

  getDuration() {
    let duration = this.job.totalRuntime;
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
