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

(() => {
  const cloudApplicationList = [
    'docker',
    'plesk',
    'kubernetes',
    'swarm',
    'cozycloud',
    'wordpress',
    'prestashop',
    'lamp',
    'cassandra',
    'hadoop',
    'mongodb',
    'elasticsearch',
    'gitlab',
    'cpanel',
    'spark',
    'postgre',
    'owncloud',
    'sqlserver',
    'ansible',
    'rancheros',
    'routeros',
    'joomla',
    'drupal',
    'mariadb',
    'kafka',
    'hbase',
    'marathon',
    'mesos',
    'pfsense',
    'opensuse',
    'dcos',
    'openvpn',
    'vestacp',
    'virtualmin',
    'datascience',
    'deeplearning',
    'rstudio',
    'minikube',
    'nvidia_ngc',
    'dataiku',
  ];

  class CloudImageService {
    static augmentImage(image) {
      if (!image) {
        return null;
      }
      const augmentedImage = cloneDeep(image);

      if (includes(augmentedImage.tags, 'application')) {
        augmentedImage.apps = true;
        augmentedImage.applications = intersection(
          augmentedImage.tags,
          cloudApplicationList,
        );
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
      const filters = { apps: false, status: 'active' };

      if (isString(region)) {
        filters.region = region;
      }

      forEach(imagesTypes, (imageType) => {
        filters.type = imageType;
        filteredImages[imageType] = filter(cloneDeep(images), filters);
      });

      return filteredImages;
    }

    static getApps(images, region = null) {
      const filters = { apps: true, status: 'active' };

      if (isString(region)) {
        set(filters, 'region', region);
      }

      return filter(cloneDeep(images), filters);
    }

    /* eslint-disable no-nested-ternary */
    groupImagesByType(images, imagesTypes, region = null) {
      const filteredImages = this.constructor.getImagesByType(
        images,
        imagesTypes,
        region,
      );
      const groupedImages = {};

      forEach(filteredImages, (list, type) => {
        groupedImages[type] = groupBy(list, 'distribution');
        forEach(groupedImages[type], (version, distribution) => {
          groupedImages[type][distribution] = uniqBy(
            forEach(version, (image) => {
              // eslint-disable-next-line no-param-reassign
              delete image.region;
              // eslint-disable-next-line no-param-reassign
              delete image.id;
            }),
            'name',
          ).sort((image1, image2) =>
            image1.name > image2.name ? -1 : image1.name < image2.name ? 1 : 0,
          );
        });
      });

      return groupedImages;
    }
    /* eslint-enable no-nested-ternary */

    static isSnapshot(image) {
      return get(image, 'visibility', '') === 'private';
    }
  }

  angular.module('managerApp').service('CloudImageService', CloudImageService);
})();
