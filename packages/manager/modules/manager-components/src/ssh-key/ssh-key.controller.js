import { SSH_KEY } from './ssh-key.constants';

export default class SshKeyController {
  /* @ngInject */
  constructor(SshKeyService) {
    this.SshKeyService = SshKeyService;
  }

  $onInit() {
    this.loading = {
      init: true,
      sshkey: false,
    };
    this.ssh = {
      inputRules: SSH_KEY,
    };
    this.loadSshKeys();
    this.loading.init = false;
  }

  loadSshKeys() {
    this.loading.sshkey = true;
    this.SshKeyService.getSshKeys()
      .then(({ data }) => {
        this.userSshKeys = data.sort();
        return this.userSshKeys;
      })
      .catch(() =>
        this.CucCloudMessage.error(
          this.$translate.instant('manager_components_loading_sshKeys_error'),
        ),
      )
      .finally(() => {
        this.loading.sshkey = false;
      });
  }

  getSshKeyInfo() {
    this.loading.sshkey = true;
    return this.SshKeyService.getSshKeyInfo(this.selectedSshKey)
      .then(({ data }) => {
        this.publicKey = data.key;
      })
      .finally(() => {
        this.loading.sshkey = false;
      });
  }
}
