const RECORD_SIZE_ENUM = 'dedicated.storage.RecordSizeEnum';
const SYNC_ENUM = 'dedicated.storage.SyncEnum';
const SYNC_TRANSLATE_KEY = 'nasha_components_partition_zfs_options_sync_';

const defaultOptions = {
  atime: 'off',
  recordsize: '131072',
  sync: 'standard',
};

const formatOptionsFromAPI = ({ atime, recordsize, sync }) => ({
  atime: atime === 'on',
  recordsize,
  sync,
});

const formatOptionsToAPI = ({ atime, recordsize, sync }) => ({
  atime: atime ? 'on' : 'off',
  recordsize,
  sync,
});

const formatRecordSizeEnum = (schema, bytesFilter) =>
  schema.models[RECORD_SIZE_ENUM].enum
    .map((recordsize) => ({
      value: recordsize,
      label: bytesFilter(parseInt(recordsize, 10), true),
      default: recordsize === defaultOptions.recordsize,
    }))
    .sort(({ value: a }, { value: b }) => Number(a) - Number(b));

const formatSyncEnum = (schema, $translate) =>
  schema.models[SYNC_ENUM].enum.map((sync) => ({
    value: sync,
    label: $translate.instant(SYNC_TRANSLATE_KEY + sync),
    default: sync === defaultOptions.sync,
  }));

export default class ZfsOptionsService {
  /* @ngInject */
  constructor($q, $filter, $translate, OvhApiDedicatedNasha) {
    this.$q = $q;
    this.$filter = $filter;
    this.$translate = $translate;
    this.OvhApiDedicatedNasha = OvhApiDedicatedNasha;
  }

  getOptions(serviceName, partitionName) {
    return this.OvhApiDedicatedNasha.Partition()
      .Options()
      .v6()
      .get({ serviceName, partitionName })
      .$promise.then(formatOptionsFromAPI)
      .catch((error) => {
        if (error.status === 404) return formatOptionsFromAPI(defaultOptions);
        return this.$q.reject(error);
      });
  }

  setOptions(serviceName, partitionName, options) {
    const formattedOptions = formatOptionsToAPI(options);
    return this.OvhApiDedicatedNasha.Partition()
      .Options()
      .v6()
      .save({ serviceName, partitionName }, formattedOptions).$promise;
  }

  getEnums() {
    return this.OvhApiDedicatedNasha.v6()
      .schema()
      .$promise.then((schema) => ({
        recordsize: formatRecordSizeEnum(schema, this.$filter('bytes')),
        sync: formatSyncEnum(schema, this.$translate),
      }));
  }
}
