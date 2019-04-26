import filter from 'lodash/filter';
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

    return Promise.all([
      this.getImages(),
      this.getSnapshots(),
    ])
      .finally(() => {
        this.isLoading = false;
      });
  }

  getImages() {
    return this.PciProjectImages.getImages(this.serviceName)
      .then((images) => {
        this.images = images;
        this.updateImages(images);
        return images;
      });
  }

  updateImages(images) {
    const [appImages, osImages] = partition(
      filter(images, image => image.isActive()), image => image.isApp(),
    );
    this.os = reduce(this.PciProjectImages.constructor.groupByType(osImages),
      (imagesByType, imagesOfType, type) => ({
        ...imagesByType,
        [type]: this.PciProjectImages.constructor.groupByDistribution(imagesOfType),
      }), {});
    this.apps = appImages;
  }

  getSnapshots() {
    return this.PciProjectImages.getSnapshots(this.serviceName)
      .then((snapshots) => {
        this.snapshots = snapshots;
      });
  }

  changeDistribution(distribution, images) {
    if (images.length === 1) {
      [this.selectedImage] = images;
    }
  }

  changeImageType() {
    this.imagesFromDistribution = [];
  }

  onImageChange(image) {
    this.selectedImage = image;
  }

  isCompatible(image) {
    return image.isAvailableInRegion(this.region) && image.isCompatibleWithFlavor(this.flavorType);
  }

  isDistributionCompatible(images) {
    return some(images, image => this.isCompatible(image));
  }
}
