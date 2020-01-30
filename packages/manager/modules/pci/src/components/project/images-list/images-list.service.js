import filter from 'lodash/filter';
import groupBy from 'lodash/groupBy';
import map from 'lodash/map';
import pick from 'lodash/pick';
import omit from 'lodash/omit';

import Image from './images.class';

export default class ImagesList {
  /* @ngInject */
  constructor(OvhApiCloudProjectImage, OvhApiCloudProjectSnapshot) {
    this.OvhApiCloudProjectImage = OvhApiCloudProjectImage;
    this.OvhApiCloudProjectSnapshot = OvhApiCloudProjectSnapshot;
  }

  static groupByType(images) {
    return groupBy(images, 'type');
  }

  static groupByDistribution(images) {
    return groupBy(images, 'distribution');
  }

  static groupByName(images) {
    const imagesByName = groupBy(images, 'name');
    return map(
      imagesByName,
      (image) =>
        new Image({
          ...omit(image[0], ['id', 'region']),
          regions: ImagesList.getImageRegions(image),
        }),
    );
  }

  static getImageRegions(image) {
    return map(image, (imageDetails) => pick(imageDetails, ['id', 'region']));
  }

  getImages(serviceName) {
    return this.OvhApiCloudProjectImage.v6()
      .query({ serviceName })
      .$promise.then((images) => ImagesList.groupByName(images));
  }

  getSnapshots(serviceName) {
    return this.OvhApiCloudProjectSnapshot.v6()
      .query({ serviceName })
      .$promise.then((snapshots) =>
        map(
          snapshots,
          (snapshot) =>
            new Image({
              ...snapshot,
              regions: ImagesList.getImageRegions(snapshot),
            }),
        ),
      );
  }

  static getCompatibleImages(images, region, flavorType) {
    return filter(
      images,
      (image) =>
        image.isAvailableInRegion(region) &&
        image.isCompatibleWithFlavor(flavorType),
    );
  }
}
