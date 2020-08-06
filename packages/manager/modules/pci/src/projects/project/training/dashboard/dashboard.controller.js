import flatten from 'lodash/flatten';
import map from 'lodash/map';
import filter from 'lodash/filter';

export default class PciTrainingDashboardController {
  /* @ngInject */
  constructor(CucCloudMessage, CucRegionService, atInternet) {
    this.CucCloudMessage = CucCloudMessage;
    this.CucRegionService = CucRegionService;
    this.atInternet = atInternet;
  }

  $onInit() {
    this.loadMessages();
    this.resourceUsage = flatten(
      map(
        filter(this.usage.resourcesUsage, {
          type: 'ai-serving-engine',
        }),
        'totalPrice',
      ),
    ).reduce((a, b) => a + b, 0);

    this.eaiConsoleUrl = 'https://console.gra.training.ai.cloud.ovh.net';
    this.eaiDocsUrl = 'https://docs.console.gra.training.ai.cloud.ovh.net';
    this.runningJobs = this.getJobsWithSelector((job) => job.isRunning());
    this.nbRunning = this.runningJobs.length;
    this.nbSuccess = this.getJobsNumberWithSelector((job) => job.isSuccess());
    this.nbFailed = this.getJobsNumberWithSelector((job) => job.isFailed());
    this.nbOther =
      this.jobList.length - this.nbSuccess - this.nbFailed - this.nbRunning;
  }

  loadMessages() {
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.training.dashboard',
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  getJobsWithSelector(selectFunction) {
    return this.jobList.filter((job) => selectFunction(job));
  }

  getJobsNumberWithSelector(selectFunction) {
    return this.getJobsWithSelector(selectFunction).length;
  }

  goToJobSubmitTracking() {
    this.atInternet.trackClick({
      name:
        'public-cloud::pci::projects::project::training::dashboard::add-job',
      type: 'action',
    });

    return this.goToJobSubmit();
  }

  goToRegistryAttachTracking() {
    this.atInternet.trackClick({
      name:
        'public-cloud::pci::projects::project::training::dashboard::attach-registry::confirm',
      type: 'action',
    });

    return this.goToRegistryAttach();
  }

  goToRegistryDetachTracking() {
    this.atInternet.trackClick({
      name:
        'public-cloud::pci::projects::project::training::dashboard::detach-registry::confirm',
      type: 'action',
    });

    return this.goToRegistryDetach();
  }
}
