import angular from 'angular';

import AddBackupStorageCtrl from './backup-storage/add-backup-storage.controller';
import DeleteBackupStorageCtrl from './backup-storage/delete-backup-storage.controller';
import EditBackupStorageCtrl from './backup-storage/edit-backup-storage.controller';
import PasswordBackupStorageCtrl from './backup-storage/password-backup-storage.controller';
import VpsOptionTerminateCtrl from './option/vps-option-terminate.controller';
import AddSecondaryDnsCtrl from './secondary-dns/add-secondary-dns.controller';
import DeleteSecondaryDnsCtrl from './secondary-dns/delete-secondary-dns.controller';
import VpsDisplayIpsCtrl from './shortcut/display-ips/vps-display-ips.controller';
import VpsKvmCtrl from './shortcut/kvm/vps-kvm.controller';
import VpsMonitoringSlaCtrl from './shortcut/monitoring-sla/vps-monitoring-sla.controller';
import VpsPasswordCtrl from './shortcut/password/vps-password.controller';
import VpsRebootCtrl from './shortcut/reboot/vps-reboot.controller';
import VpsReinstallCtrl from './shortcut/reinstall/vps-reinstall.controller';
import VpsReverseDnsCtrl from './shortcut/reverse-dns/vps-reverse-dns.controller';
import VpsDeleteSnapshotCtrl from './snapshot/snapshot-delete.controller';
import VpsRestoreSnapshotCtrl from './snapshot/snapshot-restore.controller';
import VpsTakeSnapshotCtrl from './snapshot/snapshot-take.controller';
import VpsMountCtrl from './veeam/mount/vps-mount.controller';
import VpsRestoreCtrl from './veeam/restore/vps-restore.controller';

import VpsReinstallService from './shortcut/reinstall/vps-reinstall.service';

import AddBackupStorageTemplate from './backup-storage/add-backup-storage.html';
import DeleteBackupStorageTemplate from './backup-storage/delete-backup-storage.html';
import EditBackupStorageTemplate from './backup-storage/edit-backup-storage.html';
import PasswordBackupStorageTemplate from './backup-storage/password-backup-storage.html';
import VpsOptionTerminateTemplate from './option/vps-option-terminate.html';
import AddSecondaryDnsTemplate from './secondary-dns/add-secondary-dns.html';
import DeleteSecondaryDnsTemplate from './secondary-dns/delete-secondary-dns.html';
import VpsDisplayIpsTemplate from './shortcut/display-ips/vps-display-ips.html';
import VpsKvmTemplate from './shortcut/kvm/vps-kvm.html';
import VpsMonitoringSlaTemplate from './shortcut/monitoring-sla/vps-monitoring-sla.html';
import VpsPasswordTemplate from './shortcut/password/vps-password.html';
import VpsRebootTemplate from './shortcut/reboot/vps-reboot.html';
import VpsReinstallTemplate from './shortcut/reinstall/vps-reinstall.html';
import VpsReverseDnsTemplate from './shortcut/reverse-dns/vps-reverse-dns.html';
import VpsDeleteSnapshotTemplate from './snapshot/snapshot-delete.html';
import VpsRestoreSnapshotTemplate from './snapshot/snapshot-restore.html';
import VpsTakeSnapshotTemplate from './snapshot/snapshot-take.html';
import VpsMountTemplate from './veeam/mount/vps-mount.html';
import VpsRestoreTemplate from './veeam/restore/vps-restore.html';

import ovhManagerVpsKvmNovnc from './shortcut/kvm/novnc/novnc.module';

import './shortcut/kvm/vps-kvm.less';
import './shortcut/reinstall/vps-reinstall.less';

const moduleName = 'ovhManagerVpsModal';

angular
  .module(moduleName, [ovhManagerVpsKvmNovnc])
  .controller('VpsAddBackupStorageCtrl', AddBackupStorageCtrl)
  .controller('VpsDeleteBackupStorageCtrl', DeleteBackupStorageCtrl)
  .controller('VpsEditBackupStorageCtrl', EditBackupStorageCtrl)
  .controller('VpsPasswordBackupStorageCtrl', PasswordBackupStorageCtrl)
  .controller('VpsOptionTerminateCtrl', VpsOptionTerminateCtrl)
  .controller('VpsAddSecondaryDnsCtrl', AddSecondaryDnsCtrl)
  .controller('VpsDeleteSecondaryDnsCtrl', DeleteSecondaryDnsCtrl)
  .controller('VpsDisplayIpsCtrl', VpsDisplayIpsCtrl)
  .controller('VpsKvmCtrl', VpsKvmCtrl)
  .controller('VpsMonitoringSlaCtrl', VpsMonitoringSlaCtrl)
  .controller('VpsPasswordCtrl', VpsPasswordCtrl)
  .controller('VpsRebootCtrl', VpsRebootCtrl)
  .controller('VpsReinstallCtrl', VpsReinstallCtrl)
  .controller('VpsReverseDnsCtrl', VpsReverseDnsCtrl)
  .controller('VpsDeleteSnapshotCtrl', VpsDeleteSnapshotCtrl)
  .controller('VpsRestoreSnapshotCtrl', VpsRestoreSnapshotCtrl)
  .controller('VpsTakeSnapshotCtrl', VpsTakeSnapshotCtrl)
  .controller('VpsMountCtrl', VpsMountCtrl)
  .controller('VpsRestoreCtrl', VpsRestoreCtrl)
  .service('VpsReinstallService', VpsReinstallService)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'vps/modal/backup-storage/add-backup-storage.html',
        AddBackupStorageTemplate,
      );
      $templateCache.put(
        'vps/modal/backup-storage/delete-backup-storage.html',
        DeleteBackupStorageTemplate,
      );
      $templateCache.put(
        'vps/modal/backup-storage/edit-backup-storage.html',
        EditBackupStorageTemplate,
      );
      $templateCache.put(
        'vps/modal/backup-storage/password-backup-storage.html',
        PasswordBackupStorageTemplate,
      );
      $templateCache.put(
        'vps/modal/option/vps-option-terminate.html',
        VpsOptionTerminateTemplate,
      );
      $templateCache.put(
        'vps/modal/secondary-dns/add-secondary-dns.html',
        AddSecondaryDnsTemplate,
      );
      $templateCache.put(
        'vps/modal/secondary-dns/delete-secondary-dns.html',
        DeleteSecondaryDnsTemplate,
      );
      $templateCache.put(
        'vps/modal/shortcut/display-ips/vps-display-ips.html',
        VpsDisplayIpsTemplate,
      );
      $templateCache.put('vps/modal/shortcut/kvm/vps-kvm.html', VpsKvmTemplate);
      $templateCache.put(
        'vps/modal/shortcut/monitoring-sla/vps-monitoring-sla.html',
        VpsMonitoringSlaTemplate,
      );
      $templateCache.put(
        'vps/modal/shortcut/password/vps-password.html',
        VpsPasswordTemplate,
      );
      $templateCache.put(
        'vps/modal/shortcut/reboot/vps-reboot.html',
        VpsRebootTemplate,
      );
      $templateCache.put(
        'vps/modal/shortcut/reinstall/vps-reinstall.html',
        VpsReinstallTemplate,
      );
      $templateCache.put(
        'vps/modal/shortcut/reverse-dns/vps-reverse-dns.html',
        VpsReverseDnsTemplate,
      );
      $templateCache.put(
        'vps/modal/snapshot/snapshot-delete.html',
        VpsDeleteSnapshotTemplate,
      );
      $templateCache.put(
        'vps/modal/snapshot/snapshot-restore.html',
        VpsRestoreSnapshotTemplate,
      );
      $templateCache.put(
        'vps/modal/snapshot/snapshot-take.html',
        VpsTakeSnapshotTemplate,
      );
      $templateCache.put(
        'vps/modal/veeam/mount/vps-mount.html',
        VpsMountTemplate,
      );
      $templateCache.put(
        'vps/modal/veeam/restore/vps-restore.html',
        VpsRestoreTemplate,
      );
    },
  );

export default moduleName;
