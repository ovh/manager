/**
 * @typedef {{
 *   canCreatePartition: boolean
 *   customName: string
 *   datacenter: string
 *   diskType: string
 *   info: Object<string,any>
 *   ip: string
 *   monitored: boolean
 *   partitions: NashaPartition[] | null
 *   serviceName: string
 *   tasks: NashaTask[] | null
 *   translation: { datacenter: string }
 *   use?: { size: NashaUse, used: NashaUse, usedbysnapshots: NashaUse }
 *   zpoolCapacity: number
 *   zpoolSize: number
 * }} Nasha
 */

/**
 * @typedef {{
 *   partitionCapacity: number
 *   partitionDescription: string
 *   partitionName: string
 *   protocol: string
 *   size: number
 *   use?: { size: NashaUse, used: NashaUse, usedbysnapshots: NashaUse }
 *   usedBySnapshots: number
 * }} NashaPartition
 */

/**
 * @typedef {{
 *   details: string
 *   doneDate: Date
 *   lastUpdate: Date
 *   operation: NashaTaskOperation
 *   partitionName: string
 *   status: NashaTaskStatus
 *   storageName: string | null
 *   taskId: number
 *   todoDate: Date | null
 *   translation: { operation: string }
 * }} NashaTask
 */

/**
 * @typedef {{
 *   translation: { type: string, unit: string }
 *   value: number
 *   unit: string
 * }} NashaUse
 */

/**
 * @enum {string}
 */
export const NashaTaskOperation = {
  CustomSnapshotCreate: 'clusterLeclercCustomSnapCreate',
  CustomSnapshotDelete: 'clusterLeclercCustomSnapDelete',
  PartitionCreate: 'clusterLeclercPartitionAdd',
  PartitionDelete: 'clusterLeclercPartitionDelete',
  PartitionUpdate: 'clusterLeclercPartitionUpdate',
  SnapshotUpdate: 'clusterLeclercSnapshotUpdate',
  ZfsOptions: 'clusterLeclercZfsOptions',
};

/**
 * @enum {string}
 */
export const NashaTaskStatus = {
  Doing: 'doing',
  Todo: 'todo',
};

const USE_TYPES = ['size', 'used', 'usedbysnapshots'];

export default class NashaService {
  /** @ngInject */
  constructor($translate, $http, $q, $filter) {
    this.$translate = $translate;
    this.$http = $http;
    this.$q = $q;
    this.$filter = $filter;
  }

  /**
   * @param {string} serviceName
   * @returns {Promise<Nasha>}
   */
  getNasha(serviceName) {
    return this.http({ serviceName }).then((nasha) => ({
      ...nasha,
      translation: {
        datacenter: this.translate('datacenter', nasha.datacenter),
      },
    }));
  }

  /**
   * @param {Nasha} nasha
   * @return {Promise<Nasha>}
   */
  getPartitions(nasha) {
    return this.http({
      nasha,
      endpoint: 'partition',
      expand: true,
    });
  }

  /**
   * @param {Nasha} nasha
   * @returns {Promise<Nasha>}
   */
  getTasks(nasha) {
    return this.http({ nasha, endpoint: 'task', expand: true }).then((tasks) =>
      tasks.map(({ doneDate, lastUpdate, todoDate, ...task }) => ({
        ...task,
        doneDate: doneDate ? new Date(doneDate) : null,
        lastUpdate: lastUpdate ? new Date(lastUpdate) : null,
        todoDate: todoDate ? new Date(todoDate) : null,
        translation: {
          operation: this.translate('operation', task.operation),
        },
      })),
    );
  }

  /**
   * @param {Nasha} nasha
   * @param {NashaPartition} [partition]
   * @returns {Promise<Nasha|NashaPartition>}
   */
  getUse(nasha, partition) {
    return this.$q
      .all(
        USE_TYPES.map((type) =>
          this.http({ nasha, partition, endpoint: 'use', params: { type } }),
        ),
      )
      .then((uses) =>
        uses.reduce((map, item, index) => {
          const type = USE_TYPES[index];
          return {
            ...map,
            [type]: {
              ...item,
              translation: {
                unit: this.translate('use_unit', item.unit),
                type: (() => {
                  const key = `nasha_use_type_${type}`;
                  const val = this.translate('use_type', type);
                  return val === key ? type : val;
                })(),
              },
            },
          };
        }, {}),
      );
  }

  /**
   * @param {Nasha} nasha
   * @returns {Promise<Object>}
   */
  getInfo(nasha) {
    return this.http({ nasha, endpoint: 'serviceInfos' });
  }

  /**
   * @param {{
   *   method?: 'get'
   *   nasha?: Nasha
   *   serviceName?: string
   *   partition?: NashaPartition
   *   endpoint?: 'partition' | 'task' | 'use' | 'serviceInfos'
   *   params?: Object<string,any>
   *   data?: Object<string,any>
   *   expand: boolean | { mode: 'Page' }
   * }} param0
   * @returns {Promise<any>}
   */
  http({
    method = 'get',
    serviceName = '',
    nasha = null,
    partition = null,
    endpoint = '',
    params = {},
    data = {},
    expand = false,
  }) {
    const urlParts = ['', 'dedicated', 'nasha'];
    const headers = {};

    if (serviceName) urlParts.push(serviceName);
    if (nasha) urlParts.push(nasha.serviceName);
    if (partition) urlParts.push('partition', partition.partitionName);
    if (endpoint) urlParts.push(endpoint);

    if (expand) {
      const { mode = 'Pages' } = expand;
      headers['X-Pagination-Mode'] = `CachedObjectList-${mode}`;
    }

    return this.$http[method](urlParts.join('/'), {
      ...data,
      params,
      headers,
    }).then((response) => response.data);
  }

  /**
   * @param {'datacenter'|'operation'|'snapshot_type'|'use_type'|'use_unit'} type
   * @param {string} key
   * @param {Object<string,any>} [values]
   * @returns {string}
   */
  translate(type, key, values) {
    return this.$translate.instant(`nasha_${type}_${key}`, values);
  }
}
