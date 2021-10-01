import get from 'lodash/get';
import uniq from 'lodash/uniq';
import filter from 'lodash/filter';
import map from 'lodash/map';
import head from 'lodash/head';
import { nameGenerator } from '../../../data-processing/data-processing.utils';
import { DISCORD_URL, DOC_DOCKER_BUILD_URL } from '../../training.constants';

export default class PciTrainingJobsSubmitController {
  /* @ngInject */
  constructor(
    $translate,
    PciProjectTrainingService,
    PciProjectTrainingJobService,
    PciProjectStorageContainersService,
    atInternet,
    coreConfig,
  ) {
    this.coreConfig = coreConfig;
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
      privateSwift: {
        region: this.httpHeader[index].model.container.region,
        container: this.httpHeader[index].model.container.name,
        prefix: this.httpHeader[index].model.prefix,
      },
      mountPath: this.httpHeader[index].model.mountPath,
      permission: this.httpHeader[index].model.permission,
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
    this.PriceFormatter = new Intl.NumberFormat(
      this.coreConfig.getUserLocale().replace('_', '-'),
      {
        style: 'currency',
        currency: this.coreConfig.getUser().currency.code,
        maximumFractionDigits: 2,
      },
    );

    this.httpHeader = [];
    this.volumesPermissions = ['RO', 'RW'];
    this.discordUrl = DISCORD_URL;
    this.docDockerBuildUrl = DOC_DOCKER_BUILD_URL;
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
    this.flavors = [];
    this.flavorsType = [];
    this.flavorsTypeSelected = 'gpu';
    this.flavorSelected = {};
    this.flavorPrice = 0;
    this.flavorPriceTax = 0;
    this.showAdvancedImage = false;
    this.onChangeRegion(head(this.regions));
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
    this.loading = true;
    this.PciProjectTrainingService.getJobCliCommand(
      this.projectId,
      this.computeJobSpec(),
    )
      .then(({ data: { command } }) => {
        this.cliCommandValue = command;
      })
      .finally(() => {
        this.loading = false;
      });
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
        flavor: this.job.resources.flavor,
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
    this.PciProjectTrainingService.getFlavors(this.projectId, region.id).then(
      ({ data }) => {
        this.flavors = map(data, (flavor) => {
          const catalog = this.getCatalogEntryF(flavor.id);
          const enrichedFlavor = flavor;
          enrichedFlavor.catalog = catalog;
          return enrichedFlavor;
        });
        this.flavorsType = uniq(map(data, (x) => x.type));
        this.onResourceTypeChange();
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
    this.flavorSelected = head(
      filter(
        this.flavors,
        (x) => x.default && x.type === this.flavorsTypeSelected,
      ),
    );
    this.computePrice(1);
  }

  computePrice(modelValue) {
    this.resourceN = modelValue;
    this.flavorPrice =
      this.resourceN * this.flavorSelected.catalog.priceInUcents * 60;
    this.flavorPriceTax = this.resourceN * this.flavorSelected.catalog.tax * 60;

    this.job.resources = {
      flavor: this.flavorSelected.id,
    };

    this.job.resources[this.flavorSelected.type] = modelValue;
  }

  getFlavorPrice(flavor) {
    return this.PriceFormatter.format(flavor.catalog.price.value * 60);
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
