import groupBy from 'lodash/groupBy';
import map from 'lodash/map';
import pick from 'lodash/pick';
import omit from 'lodash/omit';
import snakeCase from 'lodash/snakeCase';
import uniq from 'lodash/uniq';

import Image from './images.class';
import { IMAGES_REGEX, REGEX_PREFIX_BAREMETAL } from './images.constants';
import {
  ONE_AZ_REGION,
  THREE_AZ_REGION,
} from '../../../projects/project/project.constants';

function getDistribution(name, type) {
  const os = IMAGES_REGEX[type];
  if (os) {
    const distribution = os.find((distrib) => distrib.regex.test(name));

    return distribution?.name || `${type}_other`;
  }

  return 'unknown';
}

export default class ImagesList {
  /* @ngInject */
  constructor($http, OvhApiCloudProjectImage, OvhApiCloudProjectSnapshot) {
    this.$http = $http;
    this.OvhApiCloudProjectImage = OvhApiCloudProjectImage;
    this.OvhApiCloudProjectSnapshot = OvhApiCloudProjectSnapshot;
    this.REGEX_PREFIX_BAREMETAL = REGEX_PREFIX_BAREMETAL;
  }

  removeBaremetalPrefix(imageType) {
    return imageType.replace(this.REGEX_PREFIX_BAREMETAL, '');
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

  getImages(serviceName, region = null) {
    return this.$http
      .get(`/cloud/project/${serviceName}/image`, {
        params: {
          region,
        },
      })
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

  // eslint-disable-next-line class-methods-use-this
  isImageCompatible(
    image,
    targetRegionName,
    flavorType,
    osTypes,
    snapshotsPlans,
    distantBackupAvailability,
  ) {
    if (image.isBackup()) {
      const targetRegion = snapshotsPlans
        .flatMap((p) => p.regions)
        .find((r) => r.name === targetRegionName);

      if (targetRegionName !== image.region) {
        if (!distantBackupAvailability) return false;

        if (![ONE_AZ_REGION, THREE_AZ_REGION].includes(targetRegion.type))
          return false;

        const imageRegion = snapshotsPlans
          .find((p) => p.code === image.planCode)
          .regions.find((r) => r.name === image.region);

        if (![ONE_AZ_REGION, THREE_AZ_REGION].includes(imageRegion.type))
          return false;
      }
    } else if (!image.isAvailableInRegion(targetRegionName)) {
      return false;
    }

    return (
      image.isCompatibleWithFlavor(flavorType) &&
      image.isCompatibleWithOsTypes(osTypes)
    );
  }
}
