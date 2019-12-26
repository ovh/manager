import filter from 'lodash/filter';
import find from 'lodash/find';
import first from 'lodash/first';
import keys from 'lodash/keys';
import partition from 'lodash/partition';
import reduce from 'lodash/reduce';
import some from 'lodash/some';

import { IMAGE_ASSETS } from './images.constants';

export default class ImagesListController {
  /* @ngInject */
  constructor(
    // $translate,
    OvhApiCloudProjectImage,
    OvhApiCloudProjectSnapshot,
    PciProjectImages,
  ) {
    // this.$translate = $translate;
    this.OvhApiCloudProjectImage = OvhApiCloudProjectImage;
    this.OvhApiCloudProjectSnapshot = OvhApiCloudProjectSnapshot;
    this.PciProjectImages = PciProjectImages;

    this.IMAGE_ASSETS = IMAGE_ASSETS;
  }

  $onInit() {
    this.distribution = null;
    this.image = null;

    this.showOnlyAvailable = false;

    this.isLoading = true;

    return Promise.all([this.getImages(), this.getSnapshots()])
      .then(() => this.findDefaultImage())
      .finally(() => {
        this.isLoading = false;
      });
  }

  getImages() {
    return this.PciProjectImages.getImages(this.serviceName).then((images) => {
      this.images = images;
      this.updateImages(images);
      return images;
    });
  }

  updateImages(images) {
    const [appImages, osImages] = partition(
      filter(images, (image) => image.isActive()),
      (image) => image.isApp(),
    );
    this.os = reduce(
      this.PciProjectImages.constructor.groupByType(osImages),
      (imagesByType, imagesOfType, type) => ({
        ...imagesByType,
        [type]: this.PciProjectImages.constructor.groupByDistribution(
          imagesOfType,
        ),
      }),
      {},
    );
    this.apps = appImages;

    this.selectedTab = first(keys(this.os));
  }

  getSnapshots() {
    return this.PciProjectImages.getSnapshots(this.serviceName).then(
      (snapshots) => {
        this.snapshots = snapshots;
      },
    );
  }

  findDefaultImage() {
    if (this.defaultImageId) {
      find(this.os, (osList, osType) => {
        find(osList, (osSubList, osName) => {
          find(osSubList, (os) => {
            const region = find(os.regions, {
              region: this.region,
              id: this.defaultImageId,
            });
            if (region) {
              this.selectedTab = osType;
              this.distribution = osName;
              this.image = os;

              this.onImageChange(os);
            }
          });
        });
      });

      if (!this.image) {
        find(this.apps, (app) => {
          const region = find(app.regions, {
            region: this.region,
            id: this.defaultImageId,
          });
          if (region) {
            this.selectedTab = 'apps';
            this.image = app;

            this.onImageChange(app);
          }
        });
      }

      if (!this.image) {
        const snapshot = find(this.snapshots, {
          region: this.region,
          id: this.defaultImageId,
        });
        if (snapshot) {
          this.selectedTab = 'snapshots';
          this.image = snapshot;

          this.onImageChange(snapshot);
        }
      }
    }
  }

  changeDistribution(distribution, images) {
    if (images.length === 1) {
      [this.image] = images;
    } else {
      this.image = null;
    }
    this.selectedImage = this.image;
    if (this.onChange) {
      this.onChange({ image: this.selectedImage });
    }
  }

  changeImageType() {
    this.imagesFromDistribution = [];
  }

  onImageChange(image) {
    if (image.isApp() || image.isBackup()) {
      this.distribution = null;
    }
    this.selectedImage = image;
    if (this.onChange) {
      this.onChange({ image: this.selectedImage });
    }
  }

  isCompatible(image) {
    return (
      image.isAvailableInRegion(this.region) &&
      image.isCompatibleWithFlavor(this.flavorType) &&
      image.isCompatibleWithOsTypes(this.osTypes)
    );
  }

  isDistributionCompatible(images) {
    return some(images, (image) => this.isCompatible(image));
  }
}
