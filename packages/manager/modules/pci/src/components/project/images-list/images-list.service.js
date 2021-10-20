import filter from 'lodash/filter';
import groupBy from 'lodash/groupBy';
import map from 'lodash/map';
import pick from 'lodash/pick';
import omit from 'lodash/omit';
import snakeCase from 'lodash/snakeCase';
import uniq from 'lodash/uniq';

import Image from './images.class';
import { IMAGES_REGEX } from './images.constants';

function getDistribution(name, type) {
  const os = IMAGES_REGEX[type];
  if (os) {
    const distribution = os.find((distrib) => distrib.regex.test(name));

    return distribution?.name || ''.concat(type, '_other');
  }

  return 'unknown';
}

export default class ImagesList {
  /* @ngInject */
  constructor($http, OvhApiCloudProjectImage, OvhApiCloudProjectSnapshot) {
    this.$http = $http;
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
          ...omit(image[0], ['id', 'region', 'flavorTypes']),
          flavorType: uniq(
            image.flatMap(
              ({ flavorType }) => (!flavorType && []) || flavorType.split(','),
            ),
          ).join(','),
          regions: ImagesList.getImageRegions(image),
        }),
    );
  }

  static getImageRegions(image) {
    return map(image, (imageDetails) => pick(imageDetails, ['id', 'region']));
  }

  getImages(serviceName) {
    return this.$http
      .get(`/cloud/project/${serviceName}/image`)
      .then(({ data: images }) =>
        images.map((image) => {
          return {
            ...image,
            nameGeneric: snakeCase(image.name),
            distribution: getDistribution(image.name, image.type),
          };
        }),
      )
      .then((images) => ImagesList.groupByName(images));
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
