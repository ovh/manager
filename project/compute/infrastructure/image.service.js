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
  ];

  class CloudImageService {
    static augmentImage(image) {
      if (!image) {
        return null;
      }
      const augmentedImage = _.cloneDeep(image);

      if (_.includes(augmentedImage.tags, 'application')) {
        augmentedImage.apps = true;
        augmentedImage.applications = _.intersection(augmentedImage.tags, cloudApplicationList);
      } else {
        augmentedImage.apps = false;
      }
      if (image.flavorType) {
        augmentedImage.flavorType = image.flavorType.split(',');
      }
      return augmentedImage;
    }

    static getImageTypes(images) {
      return _.uniq(_.map(images, 'type'));
    }

    static getImagesByType(images, imagesTypes, region = null) {
      const filteredImages = {};
      const filter = { apps: false, status: 'active' };

      if (_.isString(region)) {
        filter.region = region;
      }

      _.forEach(imagesTypes, (imageType) => {
        filter.type = imageType;
        filteredImages[imageType] = _.filter(_.cloneDeep(images), filter);
      });

      return filteredImages;
    }

    static getApps(images, region = null) {
      const filter = { apps: true, status: 'active' };

      if (_.isString(region)) {
        _.set(filter, 'region', region);
      }

      return _.filter(_.cloneDeep(images), filter);
    }

    /* eslint-disable no-nested-ternary */
    groupImagesByType(images, imagesTypes, region = null) {
      const filteredImages = this.constructor.getImagesByType(images, imagesTypes, region);
      const groupedImages = {};

      _.forEach(filteredImages, (list, type) => {
        groupedImages[type] = _.groupBy(list, 'distribution');
        _.forEach(groupedImages[type], (version, distribution) => {
          groupedImages[type][distribution] = _.uniq(_.forEach(version, (image) => {
            delete image.region; // eslint-disable-line
            delete image.id; // eslint-disable-line
          }), 'name').sort((image1, image2) => (image1.name > image2.name ? -1 : image1.name < image2.name ? 1 : 0));
        });
      });

      return groupedImages;
    }
    /* eslint-enable no-nested-ternary */

    static isSnapshot(image) {
      return _.get(image, 'visibility', '') === 'private';
    }
  }

  angular.module('managerApp').service('CloudImageService', CloudImageService);
})();
