export default class PciTrainingJobsSubmitController {
  /* @ngInject */
  constructor(CucCloudMessage, CucRegionService) {
    this.CucCloudMessage = CucCloudMessage;
    this.CucRegionService = CucRegionService;
  }

  $onInit() {
    // Load available regions
    this.allRegionsLoaded = false;
    this.allRegions()
      .then((regions) => {
        this.regions = regions;
      })
      .finally(() => {
        this.allRegionsLoaded = true;
      });

    // Load users
    this.allUsersLoaded = false;
    this.allUsers()
      .then((users) => {
        this.users = users.map((user) => {
          return {
            name: user.username,
            description: `${user.username} (${user.description})`,
          };
        });
      })
      .finally(() => {
        this.allUsersLoaded = true;
      });

    // Form payload
    this.job = {
      region: null,
      image: null,
      command: null,
      user: null,
      resources: {
        cpu: 1,
        mem: 1,
        gpu: 0,
      },
    };

    this.loadMessages();
  }

  computePricePerMinute() {
    let price = this.resources.cpu * this.resources.mem * 0.1;
    if (this.resources.gpu > 0) {
      price += 1;
    }
    return price;
  }

  computePricePerHour() {
    return this.computePricePerMinute() * 60;
  }

  cliCommand() {
    return [
      'job',
      'submit',
      '\\\n\t',
      '--profile',
      this.job.region.name,
      '\\\n\t',
      '--image',
      this.job.image,
      '\\\n\t',
      '--cpu',
      this.resources.cpu,
      '\\\n\t',
      '--mem',
      this.resources.mem,
      '\\\n\t',
      '--gpu',
      this.resources.gpu,
    ].join(' ');
  }

  computeJobSpec() {
    return {
      image: this.job.image,
      region: this.job.region.name,
      user: this.job.user.name,
      resources: {
        cpu: this.job.resources.cpu,
        gpu: this.job.resources.gpu,
        mem: this.job.resources.mem,
      },
    };
  }

  onStepperFinish() {
    const jobsSpec = this.computeJobSpec();
    this.submitJob(jobsSpec);
  }

  loadMessages() {
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.training.jobs.submit',
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }
}
