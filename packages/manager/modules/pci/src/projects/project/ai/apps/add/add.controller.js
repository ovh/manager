import get from 'lodash/get';
import find from 'lodash/find';
import { merge } from 'lodash';
import {
  APP_PRIVACY_SETTINGS,
  APP_SCALING_SETTINGS,
  splitIntoArray,
} from './add.constants';
import { nameGenerator } from '../../../../../name-generator.constant';
import { APP_TYPES, APP_USERS_TOKENS_BANNER_TRACKING } from '../app.constants';

export default class AppAddController {
  /* @ngInject */
  constructor($translate, CucCloudMessage, AppService, $q) {
    this.$q = $q;
    this.loadingRegionDeps = false;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.AppService = AppService;

    // Stepper config object
    this.stepper = {
      appRegion: { name: 'app_region', display: null },
      appImage: { name: 'app_image', display: null },
      appResources: { name: 'app_resources', display: null },
      appSettings: { name: 'app_settings', display: null },
      appAttach: { name: 'app_attach', display: null },
      appReview: { name: 'app_review', display: null },
    };

    // App model
    this.appModel = {
      name: '',
      labels: [],
      volumes: [],
      privacy: APP_PRIVACY_SETTINGS.RESTRICTED,
      region: null,
      image: {
        isCustom: true,
        customImageName: null,
        preset: null,
        partnerConditionsAccepted: false,
      },
      scalingStrategy: {
        autoscaling: false,
        fixed: {
          replicas: APP_SCALING_SETTINGS.FIXED.DEFAULT_REPLICAS,
        },
        automatic: {
          averageUsageTarget: APP_SCALING_SETTINGS.AUTOMATIC.DEFAULT_THRESHOLD,
          replicasMax: APP_SCALING_SETTINGS.AUTOMATIC.DEFAULT_MAX_REPLICAS,
          replicasMin: APP_SCALING_SETTINGS.AUTOMATIC.DEFAULT_MIN_REPLICAS,
          resourceType: APP_SCALING_SETTINGS.AUTOMATIC.DEFAULT_RESOURCE,
        },
      },
      port: 8080,
      useCase: null,
      probe: {
        enabled: false,
        path: null,
        port: 8080,
      },
      resource: {
        nbResources: 1,
        usage: APP_TYPES.CPU,
        flavor: null,
        flavorType: APP_TYPES.CPU,
      },
      command: [],
    };
  }

  static convertLabels(labels) {
    return labels.reduce(
      (accumulator, label) => ({ ...accumulator, [label.key]: label.value }),
      {},
    );
  }

  static buildResourceBody(flavor, nbResources) {
    const { resourcesPerUnit, gpuInformation } = flavor;
    const { cpu, ...restOfResources } = resourcesPerUnit;

    return {
      [flavor.type]: nbResources,
      flavor: flavor.id,
      ...restOfResources,
      ...gpuInformation,
    };
  }

  static buildVolumesBody(volumes) {
    return volumes.map((volume) => {
      if (volume.container !== undefined) {
        return {
          mountPath: volume.mountPath,
          permission: volume.permission,
          cache: volume.cache,
          dataStore: {
            container: volume.container.name,
            alias: volume.container.region,
            prefix: volume.prefix,
          },
        };
      }
      return {
        mountPath: volume.mountPath,
        permission: volume.permission,
        cache: volume.cache,
        publicGit: {
          url: volume.gitUrl,
        },
      };
    });
  }

  static buildProbe(probe) {
    const { enabled, path, port } = probe;
    return enabled
      ? {
          path,
          port,
        }
      : null;
  }

  static buildScalingBody(scalingStrategy) {
    const { autoscaling, automatic, fixed } = scalingStrategy;
    return autoscaling ? { automatic } : { fixed };
  }

  static convertAppModel(appModel) {
    const {
      name,
      labels,
      volumes,
      image,
      region,
      resource,
      privacy,
      scalingStrategy,
      probe,
      port,
      command,
    } = appModel;

    return {
      labels: AppAddController.convertLabels(labels),
      name,
      image: image.isCustom
        ? image.customImageName
        : `${image.preset.id}:${image.preset.selectedVersion}`,
      region: region.name,
      resources: AppAddController.buildResourceBody(
        resource.flavor,
        resource.nbResources,
      ),
      partnerId: image.isCustom ? null : image.preset.partnerId,
      volumes: AppAddController.buildVolumesBody(volumes),
      unsecureHttp: APP_PRIVACY_SETTINGS.PUBLIC === privacy,
      probe: AppAddController.buildProbe(probe),
      scalingStrategy: AppAddController.buildScalingBody(scalingStrategy),
      defaultHttpPort: port,
      command,
    };
  }

  $onInit() {
    this.messageContainer = 'pci.projects.project.ai.apps.add';
    this.loadMessages();
    if (this.storages.length === 0) {
      this.appModel.volumes = [];
    }
    this.commandLine = null;
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe(this.messageContainer);
    this.messageHandler = this.CucCloudMessage.subscribe(
      this.messageContainer,
      { onMessage: () => this.refreshMessages() },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  getConfigHeader(display) {
    if (display === false) {
      const privacy = this.$translate.instant(
        `pci_app_add_privacy_settings_item_selected_${this.appModel.privacy}`,
      );

      return this.$translate.instant(
        'pci_app_add_configuration_title_selected',
        {
          app: this.appModel.name,
          labelsLength: this.appModel.labels.length,
          region: this.appModel.region.id,
          privacy,
        },
      );
    }

    return this.$translate.instant('pci_app_add_configuration_title');
  }

  getRegionHeader(display) {
    if (display === false) {
      return this.$translate.instant(
        'pci_app_add_privacy_datacenter_location_title_selected',
        {
          region: this.appModel.region.name,
        },
      );
    }

    return this.$translate.instant(
      'pci_app_add_privacy_datacenter_location_title',
    );
  }

  getImageHeader(display) {
    if (display === false) {
      const { image } = this.appModel;
      if (!image.isCustom) {
        return this.$translate.instant('pci_app_add_image_partner_header', {
          partner: image.preset.partnerName,
          image: `${image.preset.id}:${image.preset.selectedVersion}`,
        });
      }
      return this.$translate.instant('pci_app_add_image_header', {
        image: image.customImageName,
      });
    }

    return this.$translate.instant('pci_app_add_image_title');
  }

  getResourceHeader(display) {
    if (display === false) {
      return this.$translate.instant('pci_app_add_resources_title_selected', {
        flavor: this.appModel.resource.flavor.id,
        quantity: this.appModel.resource.nbResources,
      });
    }

    return this.$translate.instant('pci_app_add_resources_title');
  }

  getAttachContainerHeader(display) {
    if (display === false) {
      return this.$translate.instant('pci_app_add_attach_title_selected', {
        quantity: this.appModel.volumes.length,
      });
    }

    return this.$translate.instant('pci_app_add_attach_title');
  }

  onRegionChange({ name: regionName }) {
    this.loadingRegionDeps = true;

    this.$q
      .all([
        this.AppService.getFlavors(this.projectId, regionName),
        this.AppService.getPartnersImages(this.projectId, regionName),
        this.AppService.getPartners(this.projectId, regionName),
      ])
      .then(([flavors, presets, partners]) => {
        this.flavors = flavors;
        // We assume that cpu has the lowest price
        const defaultFlavor = find(this.flavors, { type: APP_TYPES.CPU });
        const resourcePrice = this.AppService.getPrice(
          this.prices,
          defaultFlavor.id,
        );

        this.presets = presets
          .map((preset) => {
            const partnerPriceCPU = this.AppService.getPartnerPrice(
              this.prices,
              preset.partnerId,
              preset.id,
              preset.licensing,
              APP_TYPES.CPU,
            );
            const partnerPriceGPU = this.AppService.getPartnerPrice(
              this.prices,
              preset.partnerId,
              preset.id,
              preset.licensing,
              APP_TYPES.GPU,
            );
            const partner = partners.find(
              (part) => part.id === preset.partnerId,
            );

            return merge(preset, {
              partner,
              prices: {
                cpu: partnerPriceCPU,
                gpu: partnerPriceGPU,
              },
              selectedVersion: preset.versions[0],
            });
          })
          .sort((a, b) =>
            `${a.partnerId}-${a.id}`.localeCompare(`${b.partnerId}-${b.id}`),
          );

        this.defaultPrice = resourcePrice;
      })
      .finally(() => {
        this.loadingRegionDeps = false;
        // clean model
        this.appModel.image.preset = null;
        if (this.presets.length === 0) {
          this.appModel.image.isCustom = true;
        }
      });
  }

  onImageSubmit() {
    const { image } = this.appModel;
    const imageModel = image.isCustom
      ? image.customImageName
      : `${image.preset.id}:${image.preset.selectedVersion}`;
    const splitImage = imageModel.split('/');
    const lastImagePart = splitImage[splitImage.length - 1];
    const [prefix] = lastImagePart.split(':');
    this.appModel.name = `${prefix}-${nameGenerator()}`;
    this.appModel.command = splitIntoArray(this.commandLine);
    return false;
  }

  onAppSubmit() {
    const { resource } = this.appModel;
    const flavorName = resource.flavor.name;

    this.trackApps(`config_create_app`);
    this.trackApps(
      'PublicCloud_create_new_app::'.concat(
        `${resource.usage}_${flavorName}_${resource.nbResources}`,
      ),
      undefined,
      false,
    );

    this.isAdding = true;

    const model = AppAddController.convertAppModel(this.appModel);
    const mustSignToS =
      !this.appModel.image.isCustom &&
      this.appModel.image.preset.partner.contract.signedAt === null;
    const createAppPromise = mustSignToS
      ? this.AppService.upadatePartnerSignature(
          this.projectId,
          model.region,
          model.partnerId,
        ).then(() => this.AppService.addApp(this.projectId, model))
      : this.AppService.addApp(this.projectId, model);

    return createAppPromise
      .then(() =>
        this.goToApps(
          this.$translate.instant('pci_app_add_app_create_success'),
        ).then(() => this.trackApps(`config_create_app_validated`)),
      )
      .catch((error) => {
        this.stepper.appReview.display = true;
        this.isAdding = false;
        this.trackApps(`config_create_app_error`);
        this.CucCloudMessage.error(
          this.$translate.instant('pci_app_add_app_create_error', {
            message: get(error, 'data.message'),
          }),
        );
      })
      .finally(() => {
        this.isAdding = false;
      });
  }

  goToUserTokens() {
    this.trackApps(APP_USERS_TOKENS_BANNER_TRACKING);
    this.goToUsersAndTokens();
  }
}
