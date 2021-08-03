import moment from 'moment';
import 'moment-duration-format';
import { GUIDE_URL } from '../../training.constants';

export default class PciTrainingJobsInfoController {
  /* @ngInject */
  constructor(
    CucCloudMessage,
    ovhManagerRegionService,
    $interval,
    PciProjectTrainingJobService,
  ) {
    this.CucCloudMessage = CucCloudMessage;
    this.ovhManagerRegionService = ovhManagerRegionService;
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

    const resourceN =
      this.job.spec.resources.gpu || this.job.spec.resources.cpu;

    const catalog = this.getCatalogEntryF(this.job.spec.resources.flavor);

    this.unitPrice = catalog.priceInUcents * resourceN;
    this.unitTax = catalog.tax * resourceN;
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

    // eslint-disable-next-line no-underscore-dangle
    const d = moment.duration(duration, 'seconds');

    if (duration < 60) {
      return d.format('ss[s]');
    }
    // Display minutes only if no hours
    if (duration < 3600) {
      return d.format('mm[m]:ss[s]');
    }
    // Display hours only if no days
    if (duration < 86400) {
      return d.format('HH[h]:mm[m]:ss[s]');
    }

    return d.format('DDD[d]:HH[h]:mm[m]:ss[s]');
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

  static getVolumeRepr(volume) {
    if (volume.privateSwift) {
      const prefix = volume.privateSwift.prefix
        ? `/${volume.privateSwift.prefix}`
        : '';
      return `${volume.privateSwift.container}@${volume.privateSwift.region}${prefix}:${volume.mountPath}:${volume.permission}`;
    }

    if (volume.publicSwift) {
      return `${volume.publicSwift.url}:${volume.mountPath}:${volume.permission}`;
    }

    if (volume.git) {
      return `${volume.git.url}:${volume.mountPath}:${volume.permission}`;
    }

    return 'unknown volume type';
  }
}
