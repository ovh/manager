angular
  .module('managerApp')
  .constant('DESKAAS_ACTIONS', {
    RESTORE: 'refreshVirtualDesktop',
    REBOOT: 'restartVirtualDesktop',
    DELETE: 'removeVirtualDesktop',
    UPGRADE: 'upgradeVirtualDesktop',
    SUSPEND: 'suspendVirtualDesktop',
    UPDATE_ALIAS: 'setAliasOnVirtualDesktop',
    UPDATE_USERNAME: 'updateUsername',
    OPEN: 'openVirtualDesktop',
    UPDATE_USER_PWD: 'updateUserPassword',
    CONSOLE_ACCESS: 'getConsoleAccess',
  })
  .constant('DESKAAS_REFERENCES', {
    clouddesktop1: {
      name: 'Cloud Desktop 1',
      vcpu: 1,
      ram: 2,
      storage: 10,
      gpu: 0,
      planCode: 'clouddesktop1',
      upgrades: ['clouddesktop2', 'clouddesktop3'],
    },
    clouddesktop2: {
      name: 'Cloud Desktop 2',
      vcpu: 2,
      ram: 4,
      storage: 50,
      gpu: 0,
      planCode: 'clouddesktop2',
      upgrades: ['clouddesktop3'],
    },
    clouddesktop3: {
      name: 'Cloud Desktop 3',
      vcpu: 4,
      ram: 16,
      storage: 100,
      gpu: 0,
      planCode: 'clouddesktop3',
      upgrades: [],
    },
    clouddesktop4: {
      name: 'Cloud Desktop GPU',
      vcpu: 4,
      ram: 16,
      storage: 100,
      gpu: 1,
      planCode: 'clouddesktop4',
      upgrades: [],
    },
  });
