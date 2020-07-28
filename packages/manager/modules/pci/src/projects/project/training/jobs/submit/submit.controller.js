import get from 'lodash/get';

export default class PciTrainingJobsSubmitController {
  /* @ngInject */
  constructor(
    $translate,
    CucCloudMessage,
    CucRegionService,
    PciProjectTrainingJobsService,
  ) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.CucRegionService = CucRegionService;
    this.PciProjectTrainingJobsService = PciProjectTrainingJobsService;
  }

  $onInit() {
    // Form payload
    this.job = {
      region: null,
      image: {
        id: null,
      },
      command: null,
      user: null,
      data: [],
      resources: {
        gpu: 1,
      },
    };

    // Load available regions
    this.allRegionsLoaded = false;
    this.regions()
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
        if (this.users.length === 1) {
          // eslint-disable-next-line prefer-destructuring
          this.job.user = this.users[0];
        }
      });

    this.showAdvancedImage = false;

    this.loadMessages();
  }

  getPrice() {
    return (
      this.pricesCatalog[`ai-serving-engine.ml1-c-xl.hour.consumption`]
        .priceInUcents * this.job.resources.gpu
    );
  }

  getTax() {
    return (
      this.pricesCatalog[`ai-serving-engine.ml1-c-xl.hour.consumption`].tax *
      this.job.resources.gpu
    );
  }

  setData() {
    this.dataSource = this.data
      .filter(
        ({ region, user }) =>
          region === this.job.region.name && user === this.job.user.name,
      )
      .map(({ name, id }) => {
        return {
          name: `${id}:/workspace/${name}`,
          display: `${name} (/workspace/${name})`,
        };
      });
    this.job.data = [];
    this.emptyData = this.dataSource.length === 0;
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
      this.job.image.id,
      '\\\n\t',
      '--gpu',
      this.job.resources.gpu,
      '\\\n\t',
      this.job.data.map(({ name }) => `--data ${name} `).join('\\\n\t'),
    ].join(' ');
  }

  computeJobSpec() {
    return {
      image: this.job.image.id,
      region: this.job.region.name,
      user: this.job.user.name,
      data: this.job.data.map(({ name }) => name),
      resources: {
        cpu: this.job.resources.cpu,
        gpu: this.job.resources.gpu,
        mem: this.job.resources.mem,
      },
    };
  }

  onStepperFinish() {
    this.submitJob();
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

  onClickAdvancedImage() {
    this.showAdvancedImage = !this.showAdvancedImage;
  }

  submitJob() {
    this.isSubmit = true;
    this.PciProjectTrainingJobsService.submit(
      this.projectId,
      this.computeJobSpec(),
    )
      .then(() =>
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_training_jobs_list_submit_success',
          ),
        ),
      )
      .catch((error) => {
        this.error = get(error, 'data.message');
      })
      .finally(() => {
        this.isSubmit = false;
      });
  }
}
