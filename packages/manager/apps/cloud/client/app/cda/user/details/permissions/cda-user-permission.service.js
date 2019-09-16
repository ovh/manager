angular.module('managerApp')
  .service('CdaUserPermissionService', function CdaUserPermissionService($q) {
    const self = this;

    self.accessTypes = {
      read: false,
      write: false,
      execute: false,
      classRead: false,
      classWrite: false,
    };

    self.computePoolsDisplay = function computePoolsDisplay(userPermissions, pools) {
      const permissionsObject = {};
      _.forEach(userPermissions, (userPermission) => {
        permissionsObject[userPermission.poolName] = userPermission;
      });

      return $q.when(_.map(pools, (pool) => {
        if (permissionsObject[pool.name]) {
          return _.cloneDeep(permissionsObject[pool.name]);
        }
        const defaultPermission = _.clone(self.accessTypes);
        defaultPermission.poolName = pool.name;
        return defaultPermission;
      }));
    };
  });
