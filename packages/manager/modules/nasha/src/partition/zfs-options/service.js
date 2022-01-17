import map from 'lodash/map';
import sortBy from 'lodash/sortBy';

import { NASHA_ZFS_OPTIONS_DEFAULT } from './constants';

export default class NashaPartitionZFSOptionsService {
  /* @ngInject */
  constructor($q, $filter, OvhApiDedicatedNasha) {
    const self = this;
    self.getZFSOptionsEnums = function getZFSOptionsEnums() {
      return OvhApiDedicatedNasha.v6()
        .schema()
        .$promise.then((schema) => {
          const enums = {};
          enums.recordsize = sortBy(
            map(
              schema.models['dedicated.storage.RecordSizeEnum'].enum,
              (size) => {
                const int = parseInt(size, 10);
                return {
                  size: int,
                  label: $filter('bytes')(int, true),
                  isDefault: int === NASHA_ZFS_OPTIONS_DEFAULT.recordsize,
                };
              },
            ),
            'size',
          );

          enums.sync = map(
            schema.models['dedicated.storage.SyncEnum'].enum,
            (option) => ({
              label: option,
              warning: option === 'disabled',
              isDefault: option === 'standard',
            }),
          );
          return enums;
        });
    };

    self.getCurrentZFSOptions = function getCurrentZFSOptions(
      nashaId,
      partitionName,
    ) {
      const options = {
        atime: NASHA_ZFS_OPTIONS_DEFAULT.atime === 'on',
        recordsize: NASHA_ZFS_OPTIONS_DEFAULT.recordsize,
        sync: NASHA_ZFS_OPTIONS_DEFAULT.sync,
      };
      return OvhApiDedicatedNasha.Partition()
        .Options()
        .v6()
        .get({
          serviceName: nashaId,
          partitionName,
        })
        .$promise.then((realOptions) => {
          options.atime = realOptions.atime === 'on';
          options.recordsize = parseInt(realOptions.recordsize, 10);
          options.sync = realOptions.sync;
          return options;
        })
        .catch((err) => {
          if (err.status === 404) {
            return $q.when(options);
          }
          return $q.reject(err);
        });
    };
  }
}
