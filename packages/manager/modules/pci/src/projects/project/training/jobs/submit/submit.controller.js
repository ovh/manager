import get from 'lodash/get';
import remove from 'lodash/remove';
import { nameGenerator } from '../../../data-processing/data-processing.utils';

export default class PciTrainingJobsSubmitController {
  /* @ngInject */
  constructor(
    $translate,
    PciProjectTrainingService,
    PciProjectTrainingJobService,
    PciProjectStorageContainersService,
    atInternet,
  ) {
    this.$translate = $translate;
    this.PciProjectTrainingService = PciProjectTrainingService;
    this.PciProjectTrainingJobService = PciProjectTrainingJobService;
    this.PciProjectStorageContainersService = PciProjectStorageContainersService;
    this.atInternet = atInternet;
  }

  $onInit() {
    this.volumesPermissions = ['RO', 'RW'];
    // Form payload
    this.job = {
      region: null,
      name: null,
      image: {
        id: null,
      },
      command: null,
      volumes: [],
      resources: {
        gpu: 1,
      },
    };

    this.gpus = [];
    this.selectedGpu = null;
    this.showAdvancedImage = false;
    this.emptyData = this.containers.length === 0;
    this.filterContainers();
  }

  filterContainers() {
    this.filteredContainers = this.containers
      .filter(({ archive }) => !archive)
      // Remove containers that are already on volume list
      .filter(({ name, region }) => {
        return !this.job.volumes
          // eslint-disable-next-line no-shadow
          .map(({ container, region }) => `${container}-${region}`)
          .includes(`${name}-${region}`);
      })
      .map(({ name, region }) => {
        return {
          name,
          region,
          description: `${name} - ${region}`,
        };
      });
  }

  onAddVolume(form) {
    const volume = {
      region: form.container.$viewValue.region,
      container: form.container.$viewValue.name,
      mountPath: form.mountPath.$viewValue,
      permission: form.permission.$viewValue,
    };

    this.job.volumes.push(volume);
    this.filterContainers();
  }

  // Dirty hack to validate the oui-inline-adder form
  // eslint-disable-next-line class-methods-use-this
  forceSubmitContainer(form) {
    form.$$controls.forEach((innerForm) => {
      // eslint-disable-next-line no-param-reassign
      innerForm.$error = {};
      innerForm.$setPristine();
    });
    // eslint-disable-next-line no-param-reassign
    form.$valid = true;

    return true;
  }

  onRemoveVolume(form) {
    const container = form.container.$viewValue;
    remove(
      this.job.volumes,
      (vol) =>
        vol.region === container.region && vol.container === container.name,
    );
  }

  cliCommand() {
    const baseCmdArray = [
      'job run',
      `--gpu ${this.job.resources.gpu}`,
      `--name ${this.job.name}`,
    ];

    if (this.job.volumes && this.job.volumes.length > 0) {
      this.job.volumes
        .map(
          ({ container, region, mountPath, permission }) =>
            `--volume ${container}@${region}:${mountPath}:${permission}`,
        )
        .forEach((x) => baseCmdArray.push(x));
    }

    baseCmdArray.push(`${this.job.image.id}`);

    if (this.job.command) {
      baseCmdArray.push('--');
      this.splitStringCommandIntoArray().forEach((x) => baseCmdArray.push(x));
    }

    return baseCmdArray.join(' \\\n\t');
  }

  splitStringCommandIntoArray() {
    if (this.job.command) {
      return this.job.command.match(/([^\s"])+|"[^"]+"/g).map((elt) => {
        if (elt.startsWith('"') && elt.endsWith('"')) {
          return elt.substring(1, elt.length - 1);
        }
        return elt;
      });
    }
    return [];
  }

  computeJobSpec() {
    const payload = {
      image: this.job.image.id,
      region: this.job.region.name,
      volumes: this.job.volumes,
      name: this.job.name,
      resources: {
        cpu: this.job.resources.cpu,
        gpu: this.job.resources.gpu,
        mem: this.job.resources.mem,
      },
    };
    if (this.job.command) {
      payload.command = this.splitStringCommandIntoArray();
    }
    return payload;
  }

  onChangeRegion(region) {
    // Update GPU
    this.PciProjectTrainingService.getGpus(this.projectId, region.id).then(
      (gpus) => {
        this.gpus = gpus;
        [this.selectedGpu] = this.gpus;
      },
    );
  }

  generateName() {
    const splitImage = this.job.image.id.split('/');
    const lastImagePart = splitImage[splitImage.length - 1];
    const splitTag = lastImagePart.split(':');
    const prefix = splitTag[0];
    this.job.name = `${prefix}-${nameGenerator()}`;
  }

  onStepperFinish() {
    this.submitJob();
  }

  onClickAdvancedImage() {
    this.showAdvancedImage = !this.showAdvancedImage;
  }

  submitJob() {
    this.atInternet.trackClick({
      name:
        'public-cloud::pci::projects::project::training::jobs::submit::confirm',
      type: 'action',
    });

    this.isSubmit = true;
    this.PciProjectTrainingJobService.submit(
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
