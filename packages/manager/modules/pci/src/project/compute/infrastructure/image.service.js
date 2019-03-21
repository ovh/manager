import cloneDeep from 'lodash/cloneDeep';
import filter from 'lodash/filter';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import groupBy from 'lodash/groupBy';
import includes from 'lodash/includes';
import intersection from 'lodash/intersection';
import isString from 'lodash/isString';
import map from 'lodash/map';
import set from 'lodash/set';
import uniq from 'lodash/uniq';
import uniqBy from 'lodash/uniqBy';

import { CLOUD_APPLICATION_LIST } from './constants';

export default class CloudImageService {
  static augmentImage(image) {
    if (!image) {
      return null;
    }
    const augmentedImage = cloneDeep(image);

    if (includes(augmentedImage.tags, 'application')) {
      augmentedImage.apps = true;
      augmentedImage.applications = intersection(augmentedImage.tags, CLOUD_APPLICATION_LIST);
    } else {
      augmentedImage.apps = false;
    }
    if (image.flavorType) {
      augmentedImage.flavorType = image.flavorType.split(',');
    }
    return augmentedImage;
  }

  static getImageTypes(images) {
    return uniq(map(images, 'type'));
  }

  static getImagesByType(images, imagesTypes, region = null) {
    const filteredImages = {};
    const imageFilter = { apps: false, status: 'active' };

    if (isString(region)) {
      imageFilter.region = region;
    }

    forEach(imagesTypes, (imageType) => {
      imageFilter.type = imageType;
      filteredImages[imageType] = filter(cloneDeep(images), imageFilter);
    });

    return filteredImages;
  }

  static getApps(images, region = null) {
    const filterApps = { apps: true, status: 'active' };

    if (isString(region)) {
      set(filterApps, 'region', region);
    }

    return filter(cloneDeep(images), filterApps);
  }

  /* eslint-disable no-nested-ternary */
  groupImagesByType(images, imagesTypes, region = null) {
    const filteredImages = this.constructor.getImagesByType(images, imagesTypes, region);
    const groupedImages = {};

    forEach(filteredImages, (list, type) => {
      groupedImages[type] = groupBy(list, 'distribution');
      forEach(groupedImages[type], (version, distribution) => {
        groupedImages[type][distribution] = uniqBy(forEach(version, (image) => {
          delete image.region; // eslint-disable-line
          delete image.id; // eslint-disable-line
        }), 'name').sort((image1, image2) => (image1.name > image2.name ? -1 : image1.name < image2.name ? 1 : 0));
      });
    });

    return groupedImages;
  }
  /* eslint-enable no-nested-ternary */

  static isSnapshot(image) {
    return get(image, 'visibility', '') === 'private';
  }
}
