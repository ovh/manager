import filter from 'lodash/filter';
import find from 'lodash/find';

class CloudProjectComputeSshCtrl {
  constructor(
    OvhApiCloudProjectSshKey,
    CloudProjectSSHKeyService,
    $translate,
    CucControllerHelper,
    CucCloudMessage,
    $stateParams,
    ovhDocUrl,
  ) {
    this.OvhApiCloudProjectSshKey = OvhApiCloudProjectSshKey;
    this.CloudProjectSSHKeyService = CloudProjectSSHKeyService;
    this.$translate = $translate;
    this.CucControllerHelper = CucControllerHelper;
    this.CucCloudMessage = CucCloudMessage;
    this.$stateParams = $stateParams;
    this.ovhDocUrl = ovhDocUrl;

    this.serviceName = $stateParams.projectId;
    this.addSshKeyForm = null;
    this.searchSshKeysForm = null;

    this.table = {
      sshKeysFilter: [],
    };
    this.toggle = {
      openAddSsh: false,
      sshDeleteId: null,
    };
    this.order = {
      by: 'name',
      reverse: false,
    };
    this.search = null;
  }

  $onInit() {
    this.initLoaders();

    this.getSshKeys();
    this.initGuides();
    this.initNewSshKey();
  }

  initLoaders() {
    this.createKey = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.CloudProjectSSHKeyService.createSSHKey(
          this.serviceName,
          this.sshKey,
        ),
      errorHandler: (err) =>
        this.CucCloudMessage.error(
          [
            this.$translate.instant('cpc_ssh_add_submit_error'),
            (err.data && err.data.message) || '',
          ].join(' '),
        ),
      successHandler: () => {
        this.toggleAddSshKey();
        this.getSshKeys(true);
        this.CucCloudMessage.success(
          this.$translate.instant('cpc_ssh_add_submit_success'),
        );
      },
    });

    this.keys = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () =>
        this.CloudProjectSSHKeyService.getSSHKeys(this.serviceName),
      errorHandler: (err) =>
        this.CucCloudMessage.error(
          [
            this.$translate.instant('cpc_ssh_error'),
            (err.data && err.data.message) || '',
          ].join(' '),
        ),
      successHandler: () => this.filterSshKeys(),
    });
  }

  getSshKeys(clearCache) {
    if (this.keys.loading) {
      return;
    }
    this.toggle.sshDeleteId = null;
    if (clearCache) {
      this.OvhApiCloudProjectSshKey.v6().resetQueryCache();
    }
    this.keys.load();
  }

  postSshKey() {
    if (this.createKey.loading) {
      return;
    }
    const notUnique = find(
      this.keys.data,
      (sshkey) => sshkey.name === this.sshKey.name,
    );
    if (notUnique) {
      this.CucCloudMessage.error(
        this.$translate.instant('cpc_ssh_add_submit_name_error'),
      );
      return;
    }
    this.createKey.load();
  }

  openDeleteSshKey(sshKey) {
    this.CucControllerHelper.modal.showModal({
      modalConfig: {
        templateUrl:
          'app/cloud/project/compute/ssh/delete/compute-ssh-delete.html',
        controller: 'CloudProjectComputeSshDeleteCtrl',
        controllerAs: '$ctrl',
        resolve: {
          serviceName: () => this.serviceName,
          sshKey: () => sshKey,
        },
      },
      successHandler: () => {
        this.getSshKeys(true);
        this.CucCloudMessage.success(
          this.$translate.instant('cpc_ssh_delete_success'),
        );
      },
      errorHandler: (err) =>
        this.CucCloudMessage.error(
          [
            this.$translate.instant('cpc_ssh_delete_error'),
            (err.data && err.data.message) || '',
          ].join(' '),
        ),
    });
  }

  initNewSshKey() {
    this.sshKey = {
      name: null,
      publicKey: null,
    };
  }

  initGuides() {
    this.guides = {
      create: this.ovhDocUrl.getDocUrl('g1769.creating_ssh_keys'),
      add: this.ovhDocUrl.getDocUrl('g1924.configuring_additionnal_ssh_key'),
      change: this.ovhDocUrl.getDocUrl(
        'g2069.replacing_your_lost_ssh_key_pair',
      ),
    };
  }

  filterSshKeys() {
    if (this.searchSshKeysForm && this.searchSshKeysForm.$valid) {
      const filteredKeys = filter(this.keys.data, (sshKey) =>
        this.isSshKeyMatchSearchCriterias(sshKey),
      );

      this.table.sshKeysFilter = filteredKeys;

      if (this.table.sshKeysFilter.length) {
        this.orderBy();
      }
    }
  }

  isSshKeyMatchSearchCriterias(sshKey) {
    if (this.search && sshKey.name) {
      return (
        sshKey.name.toLowerCase().indexOf(this.search.toLowerCase()) !== -1
      );
    }

    return true;
  }

  toggleAddSshKey() {
    if (this.toggle.openAddSsh) {
      this.initNewSshKey();
    }
    this.toggle.openAddSsh = !this.toggle.openAddSsh;
  }

  orderBy(by) {
    if (by) {
      if (this.order.by === by) {
        this.order.reverse = !this.order.reverse;
      } else {
        this.order.by = by;
      }
    }
  }

  static selectSshKey(id, active) {
    if (active) {
      setTimeout(() => {
        const sshKeyObject = $(`#sshkey_${id}`);
        const areaHeight = sshKeyObject.prop('scrollHeight');
        sshKeyObject.height(areaHeight).select();
      }, 0);
    }
  }
}

angular
  .module('managerApp')
  .controller('CloudProjectComputeSshCtrl', CloudProjectComputeSshCtrl);
