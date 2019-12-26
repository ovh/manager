export default class VpsActionService {
  /* @ngInject */
  constructor(CucControllerHelper) {
    this.CucControllerHelper = CucControllerHelper;
  }

  rescue(serviceName) {
    return this.CucControllerHelper.modal.showModal({
      modalConfig: {
        templateUrl: 'vps/modal/shortcut/password/vps-password.html',
        controller: 'VpsPasswordCtrl',
        controllerAs: '$ctrl',
        resolve: {
          serviceName: () => serviceName,
        },
      },
    });
  }

  reboot(serviceName) {
    return this.CucControllerHelper.modal.showModal({
      modalConfig: {
        templateUrl: 'vps/modal/shortcut/reboot/vps-reboot.html',
        controller: 'VpsRebootCtrl',
        controllerAs: '$ctrl',
        resolve: {
          serviceName: () => serviceName,
        },
      },
    });
  }

  reinstall(serviceName) {
    return this.CucControllerHelper.modal.showModal({
      modalConfig: {
        templateUrl: 'vps/modal/shortcut/reinstall/vps-reinstall.html',
        controller: 'VpsReinstallCtrl',
        controllerAs: '$ctrl',
        resolve: {
          serviceName: () => serviceName,
        },
      },
    });
  }

  kvm(serviceName, noVNC) {
    return this.CucControllerHelper.modal.showModal({
      modalConfig: {
        size: 'lg',
        templateUrl: 'vps/modal/shortcut/kvm/vps-kvm.html',
        controller: 'VpsKvmCtrl',
        controllerAs: '$ctrl',
        resolve: {
          serviceName: () => serviceName,
          noVNC: () => noVNC,
        },
      },
    });
  }

  monitoringSla(serviceName, state, preview) {
    return this.CucControllerHelper.modal.showModal({
      modalConfig: {
        templateUrl:
          'vps/modal/shortcut/monitoring-sla/vps-monitoring-sla.html',
        controller: 'VpsMonitoringSlaCtrl',
        controllerAs: '$ctrl',
        resolve: {
          serviceName: () => serviceName,
          preview: () => preview || false,
          state: () => state,
        },
      },
    });
  }

  displayIps(serviceName) {
    return this.CucControllerHelper.modal.showModal({
      modalConfig: {
        templateUrl: 'vps/modal/shortcut/display-ips/vps-display-ips.html',
        controller: 'VpsDisplayIpsCtrl',
        controllerAs: '$ctrl',
        resolve: {
          serviceName: () => serviceName,
        },
      },
    });
  }

  reverseDns(serviceName) {
    return this.CucControllerHelper.modal.showModal({
      modalConfig: {
        templateUrl: 'vps/modal/shortcut/reverse-dns/vps-reverse-dns.html',
        controller: 'VpsReverseDnsCtrl',
        controllerAs: '$ctrl',
        resolve: {
          serviceName: () => serviceName,
        },
      },
    });
  }

  deleteSecondaryDns(serviceName, domain) {
    return this.CucControllerHelper.modal.showModal({
      modalConfig: {
        templateUrl: 'vps/modal/secondary-dns/delete-secondary-dns.html',
        controller: 'VpsDeleteSecondaryDnsCtrl',
        controllerAs: '$ctrl',
        resolve: {
          serviceName: () => serviceName,
          domain: () => domain,
        },
      },
    });
  }

  addSecondaryDns(serviceName) {
    return this.CucControllerHelper.modal.showModal({
      modalConfig: {
        templateUrl: 'vps/modal/secondary-dns/add-secondary-dns.html',
        controller: 'VpsAddSecondaryDnsCtrl',
        controllerAs: '$ctrl',
        resolve: {
          serviceName: () => serviceName,
        },
      },
    });
  }

  deleteBackupStorage(serviceName, access) {
    return this.CucControllerHelper.modal.showModal({
      modalConfig: {
        templateUrl: 'vps/modal/backup-storage/delete-backup-storage.html',
        controller: 'VpsDeleteBackupStorageCtrl',
        controllerAs: '$ctrl',
        resolve: {
          serviceName: () => serviceName,
          access: () => access,
        },
      },
    });
  }

  addBackupStorage(serviceName) {
    return this.CucControllerHelper.modal.showModal({
      modalConfig: {
        templateUrl: 'vps/modal/backup-storage/add-backup-storage.html',
        controller: 'VpsAddBackupStorageCtrl',
        controllerAs: '$ctrl',
        resolve: {
          serviceName: () => serviceName,
        },
      },
    });
  }

  resetPasswordBackupStorage(serviceName) {
    return this.CucControllerHelper.modal.showModal({
      modalConfig: {
        templateUrl: 'vps/modal/backup-storage/password-backup-storage.html',
        controller: 'VpsPasswordBackupStorageCtrl',
        controllerAs: '$ctrl',
        resolve: {
          serviceName: () => serviceName,
        },
      },
    });
  }

  editBackupStorage(serviceName, row) {
    return this.CucControllerHelper.modal.showModal({
      modalConfig: {
        templateUrl: 'vps/modal/backup-storage/edit-backup-storage.html',
        controller: 'VpsEditBackupStorageCtrl',
        controllerAs: '$ctrl',
        resolve: {
          serviceName: () => serviceName,
          row: () => row,
        },
      },
    });
  }

  restore(serviceName, restorePoint) {
    return this.CucControllerHelper.modal.showModal({
      modalConfig: {
        templateUrl: 'vps/modal/veeam/restore/vps-restore.html',
        controller: 'VpsRestoreCtrl',
        controllerAs: '$ctrl',
        resolve: {
          serviceName: () => serviceName,
          RestorePoint: () => restorePoint,
        },
      },
    });
  }

  mount(serviceName, restorePoint) {
    return this.CucControllerHelper.modal.showModal({
      modalConfig: {
        templateUrl: 'vps/modal/veeam/mount/vps-mount.html',
        controller: 'VpsMountCtrl',
        controllerAs: '$ctrl',
        resolve: {
          serviceName: () => serviceName,
          RestorePoint: () => restorePoint,
          mount: () => true,
        },
      },
    });
  }

  unmount(serviceName, restorePoint) {
    return this.CucControllerHelper.modal.showModal({
      modalConfig: {
        templateUrl: 'vps/modal/veeam/mount/vps-mount.html',
        controller: 'VpsMountCtrl',
        controllerAs: '$ctrl',
        resolve: {
          serviceName: () => serviceName,
          RestorePoint: () => restorePoint,
          mount: () => false,
        },
      },
    });
  }

  orderAdditionalDisk() {
    return this.CucControllerHelper.modal.showModal({
      modalConfig: {
        templateUrl: 'vps/modal/additional-disk/order-disk.html',
        controller: 'OrderAdditionalDiskCtrl',
        controllerAs: '$ctrl',
      },
    });
  }

  deleteSnapshot(serviceName) {
    return this.CucControllerHelper.modal.showModal({
      modalConfig: {
        templateUrl: 'vps/modal/snapshot/snapshot-delete.html',
        controller: 'VpsDeleteSnapshotCtrl',
        controllerAs: '$ctrl',
        resolve: {
          serviceName: () => serviceName,
        },
      },
    });
  }

  takeSnapshot(serviceName) {
    return this.CucControllerHelper.modal.showModal({
      modalConfig: {
        templateUrl: 'vps/modal/snapshot/snapshot-take.html',
        controller: 'VpsTakeSnapshotCtrl',
        controllerAs: '$ctrl',
        resolve: {
          serviceName: () => serviceName,
        },
      },
    });
  }

  restoreSnapshot(serviceName) {
    return this.CucControllerHelper.modal.showModal({
      modalConfig: {
        templateUrl: 'vps/modal/snapshot/snapshot-restore.html',
        controller: 'VpsRestoreSnapshotCtrl',
        controllerAs: '$ctrl',
        resolve: {
          serviceName: () => serviceName,
        },
      },
    });
  }

  terminateOption(serviceName, optionName) {
    return this.CucControllerHelper.modal.showModal({
      modalConfig: {
        templateUrl: 'vps/modal/option/vps-option-terminate.html',
        controller: 'VpsOptionTerminateCtrl',
        controllerAs: '$ctrl',
        resolve: {
          serviceName: () => serviceName,
          vpsOption: () => optionName,
        },
      },
    });
  }

  terminateAdditionalDiskOption(serviceName) {
    return this.terminateOption(serviceName, 'additionalDisk');
  }

  terminateBackupStorageOption(serviceName) {
    return this.terminateOption(serviceName, 'ftpBackup');
  }

  terminateSnapshotOption(serviceName) {
    return this.terminateOption(serviceName, 'snapshot');
  }

  terminateVeeamOption(serviceName) {
    return this.terminateOption(serviceName, 'automatedBackup');
  }

  terminateWindows(serviceName) {
    return this.terminateOption(serviceName, 'windows');
  }
}
