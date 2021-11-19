import get from 'lodash/get';
import find from 'lodash/find';
import { merge } from 'lodash';
import { APP_PRIVACY_SETTINGS } from './add.constants';

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
      image: null,
      replicas: 1,
      preset: null,
      port: 8080,
      useCase: null,
      resource: {
        nbResources: 1,
        usage: 'cpu',
        flavor: null,
        flavorType: 'cpu',
      },
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
          privateSwift: {
            container: volume.container.name,
            region: volume.container.region,
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

  static convertAppModel(appModel) {
    const {
      name,
      labels,
      volumes,
      region,
      resource,
      privacy,
      replicas,
      preset,
    } = appModel;

    return {
      labels: AppAddController.convertLabels(labels),
      name,
      region: region.name,
      resources: AppAddController.buildResourceBody(
        resource.flavor,
        resource.nbResources,
      ),
      partner: preset.partner,
      volumes: AppAddController.buildVolumesBody(volumes),
      unsecureHttp: APP_PRIVACY_SETTINGS.PUBLIC === privacy,
      scalingStrategy: {
        fixed: {
          replicas,
        },
      },
    };
  }

  $onInit() {
    this.messageContainer = 'pci.projects.project.apps.add';
    this.loadMessages();
    if (this.storages.length === 0) {
      this.appModel.volumes = [];
    }
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
      if (this.appModel.preset.partner) {
        return this.$translate.instant('pci_app_add_image_partner_header', {
          partner: this.appModel.preset.partner.name,
          image: this.appModel.image,
        });
      }
      return this.$translate.instant('pci_app_add_image_header', {
        image: this.appModel.image,
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
        this.AppService.getPresets(this.projectId, regionName),
      ])
      .then(([flavors, presets]) => {
        this.flavors = flavors;

        // We assume that cpu has the lowest price
        const defaultFlavor = find(this.flavors, { type: 'cpu' });
        const resourcePrice = this.AppService.getPrice(
          this.prices,
          defaultFlavor.id,
        );

        presets.map((preset) => {
          const partnerPrice = this.AppService.getPartnerPrice(
            this.prices,
            preset.partner.id,
            preset.partner.flavor,
            'cpu',
          );

          return merge(preset, {
            tax: partnerPrice.tax + resourcePrice.tax,
            priceInUcents:
              partnerPrice.priceInUcents + resourcePrice.priceInUcents,
          });
        });
        this.presets = presets;
        this.defaultPrice = resourcePrice;
      })
      .finally(() => {
        this.loadingRegionDeps = false;
      });
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
    return this.AppService.addApp(
      this.projectId,
      AppAddController.convertAppModel(this.appModel),
    )
      .then(() =>
        this.goToApps(
          this.$translate.instant('pci_app_add_app_create_success'),
        ).then(() => this.trackApps(`config_create_app_validated`)),
      )
      .catch((error) => {
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
}
