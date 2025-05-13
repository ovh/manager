import filter from 'lodash/filter';
import get from 'lodash/get';
import has from 'lodash/has';

import { GUIDE_URLS } from './ssh-keys.constants';

export default class SshKeysController {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    coreConfig,
    CucCloudMessage,
    OvhApiCloudProjectSshKey,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.coreConfig = coreConfig;
    this.CucCloudMessage = CucCloudMessage;
    this.OvhApiCloudProjectSshKey = OvhApiCloudProjectSshKey;
  }

  $onInit() {
    this.loaders = {
      guide: false,
      keys: false,
      isAdding: false,
    };

    this.key = null;
    this.addKeyMode = false;

    this.model = {
      name: null,
      publicKey: null,
    };

    this.loadMessages();
    this.OvhApiCloudProjectSshKey.v6().resetQueryCache();
    return this.$q.all([this.getGuideUrl(), this.getSshKeys()]);
  }

  $onChanges(changes) {
    if (this.sshKeys && has(changes, 'region')) {
      this.getAvailableKeys(this.region);
    }
  }

  getGuideUrl() {
    this.loaders.guide = true;
    return this.$q
      .when(this.coreConfig.getUser())
      .then((me) => {
        this.guideUrl = get(GUIDE_URLS, me.ovhSubsidiary, GUIDE_URLS.WORLD);
      })
      .catch(() => {
        this.guideUrl = GUIDE_URLS.WORLD;
      })
      .finally(() => {
        this.loaders.guide = false;
      });
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe('pci.components.project.instance.sshKeys');
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.components.project.instance.sshKeys',
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  getSshKeys() {
    this.loaders.keys = true;
    return this.OvhApiCloudProjectSshKey.v6()
      .query({ serviceName: this.serviceName })
      .$promise.then((sshKeys) => {
        this.sshKeys = sshKeys;
        this.getAvailableKeys(this.region);

        this.sshKeyForm.$setPristine();
        this.sshKeyForm.$setUntouched();
      })
      .catch((err) => {
        this.CucCloudMessage.error(
          this.$translate.instant('pci_project_instance_ssh_key_query_error', {
            message: get(err, 'data.message', null),
          }),
          'pci.components.project.instance.sshKeys',
        );
      })
      .finally(() => {
        this.loaders.keys = false;
      });
  }

  displayAddForm() {
    this.addKeyMode = true;
  }

  hideAddForm() {
    this.addKeyMode = false;
    this.messages = [];
  }

  addKey() {
    this.messages = [];
    this.loaders.isAdding = true;
    return this.OvhApiCloudProjectSshKey.v6()
      .save({ serviceName: this.serviceName }, this.model)
      .$promise.then((sshKey) => {
        this.key = sshKey;
        this.selectKey(sshKey);
        this.loaders.keys = true;
        this.OvhApiCloudProjectSshKey.v6().resetQueryCache();
        this.addKeyMode = false;

        return this.getSshKeys();
      })
      .catch((err) => {
        this.CucCloudMessage.error(
          this.$translate.instant('pci_project_instance_ssh_key_add_error', {
            message: get(err, 'data.message', null),
          }),
          'pci.components.project.instance.sshKeys',
        );
      })
      .finally(() => {
        this.loaders.isAdding = false;
      });
  }

  getAvailableKeys(region) {
    this.availableKeys = filter(this.sshKeys, ({ regions }) =>
      regions.includes(region),
    );

    if (this.availableKeys.length === 0) {
      this.selectedKey = null;
      this.displayAddForm();
    } else {
      this.hideAddForm();
    }
  }

  selectKey(key) {
    this.selectedKey = key;
  }
}
