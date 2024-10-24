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
    $q,
    OvhApiCloudProjectImage,
    OvhApiCloudProjectSnapshot,
    PciProjectImages,
  ) {
    this.$q = $q;
    this.OvhApiCloudProjectImage = OvhApiCloudProjectImage;
    this.OvhApiCloudProjectSnapshot = OvhApiCloudProjectSnapshot;
    this.PciProjectImages = PciProjectImages;

    this.IMAGE_ASSETS = IMAGE_ASSETS;
  }

  $onInit() {
    this.distribution = null;
    this.image = null;

    this.showNonAvailable = false;

    this.isLoading = true;

    return this.$q
      .all([this.getImages(), this.getSnapshots()])
      .then(() => this.findDefaultImage())
      .finally(() => {
        this.isLoading = false;
      });
  }

  $onChanges({ osTypes }) {
    if (osTypes && this.images?.length) {
      this.updateImages(this.images);
    }
  }

  getImages() {
    return this.PciProjectImages.getImages(this.serviceName, this.region).then(
      (images) => {
        this.images = images;
        this.updateImages(images);
        return images;
      },
    );
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
    this.unavailableAppsPresent = some(
      appImages,
      (app) => !this.isCompatible(app),
    );

    this.selectedTab = first(keys(this.os));
    this.getFilteredImages();
  }

  getFilteredImages() {
    this.availableImages = {};
    this.unavailableImages = {};

    Object.entries(this.os).forEach(([imageType, distributions]) => {
      // remove the prefix "baremetal-" if it exists to merge the 2 types
      const formatedType = this.PciProjectImages.removeBaremetalPrefix(
        imageType,
      );

      if (!this.availableImages[formatedType]) {
        this.availableImages[formatedType] = {};
        this.unavailableImages[formatedType] = {};
      }

      Object.entries(distributions).forEach(([distribution, images]) => {
        [
          this.availableImages[formatedType][distribution],
          this.unavailableImages[formatedType][distribution],
        ] = partition(images, (image) => this.isCompatible(image));
      });
    });
  }

  static hasImages(distributions) {
    return some(distributions, (images) => images.length);
  }

  getSnapshots() {
    return this.PciProjectImages.getSnapshots(this.serviceName).then(
      (snapshots) => {
        this.snapshots = snapshots;
        this.unavailableSnapshotsPresent = some(
          snapshots,
          (snapshot) => !this.isCompatible(snapshot),
        );
      },
    );
  }

  findDefaultImage() {
    if (this.defaultImageId) {
      // To cover case where image is deprecated
      if (this.instance.isDeprecatedImage()) {
        this.selectedTab = this.instance.image.type;
      } else {
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
      }

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

  changeImageType(imageType) {
    this.imagesFromDistribution = [];
    this.onTabChange({ tab: imageType });
  }

  onImageChange(image, distribution) {
    if (distribution) {
      this.distribution = distribution;
    }
    this.isImageCompatible = false;
    if (image) {
      if (image.isApp() || image.isBackup()) {
        this.distribution = null;
      }
      this.isImageCompatible = this.isCompatible(image);
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
}
