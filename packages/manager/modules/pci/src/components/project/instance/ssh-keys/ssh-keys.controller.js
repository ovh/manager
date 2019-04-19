import filter from 'lodash/filter';

export default class SshKeysController {
  /* @ngInject */
  constructor(
    OvhApiCloudProjectSshKey,
  ) {
    this.OvhApiCloudProjectSshKey = OvhApiCloudProjectSshKey;
  }

  $onInit() {
    this.loaders = {
      keys: true,
      isAdding: false,
    };

    this.key = null;
    this.addKeyMode = false;

    this.model = {
      name: null,
      key: null,
    };

    return this.getSshKeys()
      .finally(() => {
        this.loaders.keys = false;
      });
  }

  getSshKeys() {
    return this.OvhApiCloudProjectSshKey.v6().query({ serviceName: this.serviceName }).$promise
      .then((sshKeys) => {
        this.sshKeys = sshKeys;
        this.getAvailableKeys(this.region);
      });
  }

  addKey() {
    return this.OvhApiCloudProjectSshKey
      .v6().save({ serviceName: this.serviceName }, this.model).$promise
      .then((sshKey) => {
        this.key = sshKey;
        this.loaders.keys = true;
        this.OvhApiCloudProjectSshKey.v6().resetQueryCache();
        return this.getSshKeys();
      })
      .finally(() => {
        this.loaders.isAdding = false;
      });
  }

  getAvailableKeys(region) {
    this.availableKeys = filter(this.sshKeys, ({ regions }) => regions.includes(region));
  }

  set region(region) {
    this.getAvailableKeys(region);
  }

  selectKey(key) {
    this.selectedKey = key;
  }
}
