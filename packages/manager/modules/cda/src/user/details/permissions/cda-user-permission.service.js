import clone from 'lodash/clone';
import cloneDeep from 'lodash/cloneDeep';
import forEach from 'lodash/forEach';
import map from 'lodash/map';

export default class CdaUserPermissionService {
  /* @ngInject */
  constructor($q) {
    const self = this;

    self.accessTypes = {
      read: false,
      write: false,
      execute: false,
      classRead: false,
      classWrite: false,
    };

    self.computePoolsDisplay = function computePoolsDisplay(
      userPermissions,
      pools,
    ) {
      const permissionsObject = {};
      forEach(userPermissions, (userPermission) => {
        permissionsObject[userPermission.poolName] = userPermission;
      });

      return $q.when(
        map(pools, (pool) => {
          if (permissionsObject[pool.name]) {
            return cloneDeep(permissionsObject[pool.name]);
          }
          const defaultPermission = clone(self.accessTypes);
          defaultPermission.poolName = pool.name;
          return defaultPermission;
        }),
      );
    };
  }
}
