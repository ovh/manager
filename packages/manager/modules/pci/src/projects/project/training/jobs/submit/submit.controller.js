import get from 'lodash/get';
import head from 'lodash/head';
import { nameGenerator } from '../../../data-processing/data-processing.utils';
import { COMMUNITY_URL } from '../../training.constants';
import convertJobSpecToCliCommand from '../../command_line_converter';

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

  addHttpHeader() {
    this.httpHeader.push({
      added: false,
      model: {},
    });
  }

  onHttpHeaderAddBtnClick(index) {
    this.httpHeader[index].added = true;
    this.job.volumes.push({
      region: this.httpHeader[index].model.container.region,
      container: this.httpHeader[index].model.container.name,
      mountPath: this.httpHeader[index].model.mountPath,
      permission: this.httpHeader[index].model.permission,
      prefix: this.httpHeader[index].model.prefix,
      cache: this.httpHeader[index].model.cache,
    });
    this.addHttpHeader();
    this.job.validNextStep = this.validateVolume();
  }

  onHttpHeaderDeleteBtnClick(index) {
    this.httpHeader.splice(index, 1);
    this.job.volumes.splice(index, 1);
    this.filterContainers();
  }

  $onInit() {
    this.httpHeader = [];
    this.volumesPermissions = ['RO', 'RW'];
    this.gpuId = 'gpu';
    this.cpuId = 'cpu';
    this.communityUrl = COMMUNITY_URL;
    // Form payload
    this.job = {
      addVolume: false,
      validNextStep: true,
      validVolume: true,
      region: this.regions[0],
      name: null,
      image: {
        id: null,
      },
      command: null,
      valid: true,
      volumes: [],
      resources: {
        gpu: 1,
        cpu: 0,
      },
    };

    this.resourceN = 1; // default number of resource
    this.resourceId = 'gpu'; // default resource
    this.resource = {};
    this.selectedGpu = null;
    this.maxCpus = null;
    this.showAdvancedImage = false;
    this.emptyData = this.containers.length === 0;
    this.filterContainers();
    this.onChangeRegion(head(this.regions));
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

  /**
   * Validation of the volume to have atleast one volume and if
   * volume is added, it should have no field empty
   */
  validateVolume() {
    this.job.validVolume =
      !this.httpHeader.some(
        (volume) =>
          !volume.added &&
          volume.model.container?.description &&
          volume.model.container?.name &&
          volume.model.container?.region,
      ) && this.job.volumes.length > 0;
    return this.job.validVolume;
  }

  submitVolume() {
    this.job.validNextStep = this.validateVolume();
    this.filterContainers();
  }

  cliCommand() {
    return convertJobSpecToCliCommand(this.computeJobSpec());
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
    } else {
      payload.command = null;
    }
    return payload;
  }

  onChangeRegion(region) {
    // Update Resource
    this.PciProjectTrainingService.getResources(this.projectId, region.id).then(
      (resource) => {
        this.resource = resource;
        [this.selectedGpu] = this.resource.gpus;
        this.maxCpus = this.resource.maxCpus;
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

  onResourceTypeChange() {
    this.resourceN = 1;
    if (this.resourceId === this.cpuId) {
      this.job.resources.gpu = 0;
      this.job.resources.cpu = 1;
    } else {
      this.job.resources.gpu = 1;
      this.job.resources.cpu = 0;
    }
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

  changeAddVolume(addVolume) {
    if (!addVolume) {
      this.httpHeader = [];
      this.job.volumes = [];
    } else {
      this.addHttpHeader();
    }
  }
}
